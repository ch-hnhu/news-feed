const conn = require('../config/db.js')

module.exports = (req, res, next) => {
    const query_category = 'SELECT category_id, category_name FROM categories';
    const query_tag = 'SELECT tag_id, tag_name FROM tags';
    const query_post = 'SELECT post_id, title, post_content, image_url FROM posts';
    const query_TheThao = `
    SELECT post_id, title, post_content, image_url 
    FROM posts join categories on posts.category_id = categories.category_id
    WHERE categories.category_name = N'Thể thao'
    `;

    conn.query(query_category, (err, result) => {
        if (err) {
            console.error('Lỗi truy vấn dữ liệu:', err);
            return next();
        }
        let data = {}
        data.categories = JSON.parse(JSON.stringify(result));

        conn.query(query_tag, (err, result) => {
            if (err) {
                console.error('Lỗi truy vấn dữ liệu:', err);
                return next();
            }
            data.tags = JSON.parse(JSON.stringify(result));

            conn.query(query_post, (err, result) => {
                if (err) {
                    console.error('Lỗi truy vấn dữ liệu:', err);
                    return next();
                }
                data.posts = JSON.parse(JSON.stringify(result));

                conn.query(query_TheThao, (err, result) => {
                    if (err) {
                        console.error('Lỗi truy vấn dữ liệu:', err);
                        return next();
                    }
                    data.TheThao = JSON.parse(JSON.stringify(result));

                    res.locals.layout = data;
                    next();
                });
            });
        });
    });
};