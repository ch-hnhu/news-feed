const express = require('express')
const app = express()
const port = 8080
const bodyParser = require('body-parser')
const conn = require('./config/db.js')
const commonData = require('./middleware/commonData.js')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(commonData)
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
	const query_TheThao = `
  SELECT post_id, title, subtitle, image_url 
  FROM posts join categories on posts.category_id = categories.category_id
  WHERE posts.status = 1 AND categories.category_name = N'Thể thao'
  `;

	const query_ThoiTrang = `
  SELECT post_id, title, subtitle, image_url 
  FROM posts join categories on posts.category_id = categories.category_id
  WHERE posts.status = 1 AND categories.category_name = N'Thời trang'
  `

	const query_CongNghe = `
  SELECT post_id, title, subtitle, image_url 
  FROM posts join categories on posts.category_id = categories.category_id
  WHERE posts.status = 1 AND categories.category_name = N'Công nghệ'
  `

	const query_Game = `
  SELECT post_id, title, subtitle, image_url 
  FROM posts join categories on posts.category_id = categories.category_id
  WHERE posts.status = 1 AND categories.category_name = N'Game'
  `

	let data = {}
	conn.query(query_TheThao, (err, result) => {
		if (err) {
			console.error('Lỗi truy vấn dữ liệu:', err);
			return next();
		}
		data.TheThao = JSON.parse(JSON.stringify(result));

		conn.query(query_ThoiTrang, (err, result) => {
			if (err) {
				console.error('Lỗi truy vấn dữ liệu:', err);
				return next();
			}
			data.ThoiTrang = JSON.parse(JSON.stringify(result));

			conn.query(query_CongNghe, (err, result) => {
				if (err) {
					console.error('Lỗi truy vấn dữ liệu:', err);
					return next();
				}
				data.CongNghe = JSON.parse(JSON.stringify(result));

				conn.query(query_Game, (err, result) => {
					if (err) {
						console.error('Lỗi truy vấn dữ liệu:', err);
						return next();
					}
					data.Game = JSON.parse(JSON.stringify(result));

					res.render('layout', { content: 'content_section.ejs', data: data })
				});
			});
		})
	});
})

app.get('/404', (req, res) => {
	res.status(404).render('layout', { content: '404.ejs' })
})

app.get("/contact", (req, res) => {
	// res.render("layout", { content: "contact.ejs" });
	const success = req.query.success;
	const data = {}
	res.render("layout", { content: "contact.ejs", success: success, data: data });
});

//Xu ly form contact
app.post("/contact", (req, res) => {
	const { name, email, phone, subject, message } = req.body;
	console.log("Thông tin khách hàng:", name, email, phone, subject, message);
  
	const query =
	  "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)";
	conn.query(query, [name, email, phone, subject, message], (err, result) => {
	  if (err) {
		console.error("Error inserting contact:", err);
		res.status(500).send("Error submitting contact form");
		return;
	  }
	  // Redirect back to the contact page with a success message
	  res.redirect("/contact?success=true");
	});
  });

app.get('/post/:id', (req, res) => {
	const { id } = req.params;

	const query = `
		SELECT 
			post_id, title, subtitle, post_content, image_url, author_id, posts.category_id, posts.created_at, posts.status, views, categories.category_name, users.full_name as author
		FROM posts
			LEFT JOIN categories ON categories.category_id = posts.category_id
			LEFT JOIN users ON users.user_id = posts.author_id
		WHERE posts.post_id = ? AND posts.status = 1
	`;

	const query_related = `
		SELECT 
			post_id, title, subtitle, post_content, image_url, author_id, posts.category_id, posts.created_at, posts.status, views, categories.category_name, users.full_name as author
		FROM posts
			LEFT JOIN categories ON categories.category_id = posts.category_id
			LEFT JOIN users ON users.user_id = posts.author_id
		WHERE
			posts.category_id = (SELECT category_id FROM posts WHERE post_id = ?) 
			AND posts.post_id != ?
			AND posts.status = 1
			LIMIT 3
	`;

	conn.query(query, [id], (err, result) => {
		if (err) {
			console.error("Error inserting contact:", err);
			res.status(500).send("Error submitting contact form");
			return;
		}
		if (!result || !result[0]) {
			return res.status(404).send("Post not found");
		}
		let data = {
			post: JSON.parse(JSON.stringify(result[0]))
		}

		conn.query(query_related, [id, id], (err, result) => {
			if (err) {
				console.error("Error inserting contact:", err);
				res.status(500).send("Error submitting contact form");
				return;
			}

			data.related_post = JSON.parse(JSON.stringify(result))			
			return res.render("layout", { content: "single_page.ejs", data: data });
		});
	});
});

app.get('/search', (req, res) => {
	const searchKey = req.query.searchKey;
	console.log('searchKey:', searchKey);
	const query = `
		SELECT post_id, title, subtitle, image_url 
		FROM posts join categories on posts.category_id = categories.category_id
		WHERE posts.status = 1 AND (title LIKE ? OR subtitle LIKE ?)
	`;

	const searchKeyLike = `%${searchKey}%`;

	console.log('searchKeyLike:', searchKeyLike);
	conn.query(query, [searchKeyLike, searchKeyLike], (err, result) => {
		if (err) {
			console.error('Lỗi truy vấn dữ liệu:', err);
			return next();
		}

		console.log('result:', result);

		const data = {
			posts: JSON.parse(JSON.stringify(result)), totalPages: 5, searchTerm: searchKey
		}

		console.log('data:', data);

		res.render('layout', { content: 'search.ejs', data: data, searchKey: searchKey });
	});
});


app.post('/search', (req, res) => {
	const searchKey = req.body.searchKey;
	res.redirect(`/search?searchKey=${searchKey}`);
});

app.listen(port, () => console.log(`Server running at http://127.0.0.1:${port}`))