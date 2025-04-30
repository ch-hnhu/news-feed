const conn = require('../config/db.js');
const { default: getDateVietNam } = require('../helper/date.js');

module.exports = (req, res, next) => {
    const query_category = 'SELECT category_id, category_name FROM categories';

    const query_tag = 'SELECT tag_id, tag_name FROM tags';

    const query_post = 'SELECT post_id, title, subtitle, image_url FROM posts WHERE status = 1 ORDER BY views DESC';

    const query_latest_posts = `SELECT post_id, title, subtitle, image_url FROM posts WHERE status = 1 ORDER BY created_at DESC LIMIT 10`


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

                conn.query(query_latest_posts, (err, result) => {
                    if (err) {
                        console.error('Lỗi truy vấn dữ liệu:', err);
                        return next();
                    }
                    data.latest_posts = JSON.parse(JSON.stringify(result));

                    data.dateVietNamNow = getDateVietNam(new Date());
                    
                    res.locals.layout = data;
                    next();
                });
            });
        });
    });
};