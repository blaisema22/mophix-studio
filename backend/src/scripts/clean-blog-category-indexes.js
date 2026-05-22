// Script: clean-blog-category-indexes.js
// Drops duplicate name_/slug_ indexes from blog_categories, keeping PRIMARY, name, slug.
const sequelize = require('../../src/config/database');

(async() => {
    try {
        const [rows] = await sequelize.query("SHOW INDEX FROM blog_categories");
        const allowed = new Set(['PRIMARY', 'name', 'slug']);
        const toDrop = [];
        for (const r of rows) {
            const key = r.Key_name;
            if (!allowed.has(key) && !toDrop.includes(key)) toDrop.push(key);
        }

        if (toDrop.length === 0) {
            console.log('No extra indexes found on blog_categories.');
            process.exit(0);
        }

        console.log('Indexes to drop:', toDrop);
        for (const idx of toDrop) {
            console.log(`Dropping index: ${idx}`);
            await sequelize.query(`ALTER TABLE \`blog_categories\` DROP INDEX \`${idx}\``);
        }

        console.log('Done dropping indexes.');
        process.exit(0);
    } catch (err) {
        console.error('Error cleaning indexes:', err);
        process.exit(1);
    }
})();