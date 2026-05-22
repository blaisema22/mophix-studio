const fs = require('fs');
const path = require('path');
const sequelize = require('../../config/database');

async function applySchema() {
    const sqlPath = path.join(__dirname, '../../../database/schema.sql');
    if (!fs.existsSync(sqlPath)) {
        console.error('schema.sql not found at', sqlPath);
        process.exit(1);
    }

    const raw = fs.readFileSync(sqlPath, 'utf8');

    // Remove SQL single-line comments and normalize
    const withoutComments = raw
        .split('\n')
        .filter(line => !line.trim().startsWith('--'))
        .join('\n');

    // Split by semicolon followed by newline (best-effort)
    const statements = withoutComments
        .split(/;\s*\n/)
        .map(s => s.trim())
        .filter(Boolean);

    console.log(`Found ${statements.length} SQL statements to run.`);

    try {
        for (const [i, stmt] of statements.entries()) {
            try {
                // Skip stray markers
                if (stmt.toLowerCase().startsWith('set foreign_key_checks') || stmt.toLowerCase().startsWith('drop table')) {
                    // still run them — comment out if you want to keep safer
                }
                console.log(`Running statement ${i + 1}/${statements.length}...`);
                await sequelize.query(stmt);
            } catch (innerErr) {
                console.error(`Error running statement ${i + 1}:`, innerErr.message || innerErr);
                throw innerErr;
            }
        }

        console.log('✔ Schema applied successfully.');
        process.exit(0);
    } catch (err) {
        console.error('✘ Failed applying schema:', err.message || err);
        process.exit(1);
    }
}

applySchema();