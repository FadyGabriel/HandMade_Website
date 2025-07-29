import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ImageSlider from '../ImageSlider/ImageSlider';
import Newsletter from '../Newsletter/Newsletter';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';


const handmadeImages = [
    "https://handmade-demo-decor.myshopify.com/cdn/shop/articles/frederick-medina-eyLclwqq5ls-unsplash_1_9_da74b2c4-111f-4fe4-8474-fa90603be60a_533x.jpg?v=1751439813",
    "https://handmade-demo-decor.myshopify.com/cdn/shop/articles/katsia-jazwinska-rSaWiL0SxSM-unsplash_1_cbe65ec8-68ea-4159-b538-0a8c1ff81219_533x.jpg?v=1665069977",
    "https://handmade-demo-decor.myshopify.com/cdn/shop/articles/frederick-medina-eyLclwqq5ls-unsplash_1_12_392d9c41-32f6-4b69-a459-e1c6c5be3d36_533x.jpg?v=1751439833",
    "https://handmade-demo-decor.myshopify.com/cdn/shop/articles/frederick-medina-eyLclwqq5ls-unsplash_1_10_533x.jpg?v=1665069931",
    "https://handmade-demo-decor.myshopify.com/cdn/shop/articles/frederick-medina-eyLclwqq5ls-unsplash_1_3_214344b7-6c32-49c7-9607-fb7b33ea82eb_533x.jpg?v=1751439852",
    "https://handmade-demo-decor.myshopify.com/cdn/shop/articles/frederick-medina-eyLclwqq5ls-unsplash_1_5_533x.jpg?v=1665068546",
    "https://handmade-demo-decor.myshopify.com/cdn/shop/articles/frederick-medina-eyLclwqq5ls-unsplash_1_2_aaa3b2d5-9e6e-45a9-9676-226997f29008_533x.jpg?v=1665068515",
    "https://handmade-demo.myshopify.com/cdn/shop/articles/frederick-medina-eyLclwqq5ls-unsplash_1_1_b17b7ca7-33a3-4fdc-bf1f-7d98d9c625f1_533x.jpg?v=1665067924",
    "https://handmade-demo-decor.myshopify.com/cdn/shop/articles/frederick-medina-eyLclwqq5ls-unsplash_1_533x.jpg?v=1665068480",
    "https://handmade-demo-decor.myshopify.com/cdn/shop/articles/frederick-medina-eyLclwqq5ls-unsplash_1_4_533x.jpg?v=1665068465"
  ];

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`https://dummyjson.com/posts/${id}`);
        const data = await res.json();
        const imageIdx = parseInt(id) % handmadeImages.length;
        data.image = handmadeImages[imageIdx];
        setArticle(data);

        const relatedRes = await fetch('https://dummyjson.com/posts?limit=10');
        const relatedData = await relatedRes.json();

        const others = relatedData.posts
          .filter((item) => item.id !== data.id)
          .slice(0, 4)
          .map((item, i) => ({
            ...item,
            image: handmadeImages[(i + imageIdx + 1) % handmadeImages.length],
          }));

        setRelated(others);
      } catch (error) {
        console.error('Error loading article details:', error);
      }
    };

    fetchArticle();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article]);

  if (!article) return <div className="text-center p-10">Loading...</div>;

  return (
    <>
    {/* <Navbar /> */}
      {/* ImageSlider with Handmade Images */}
      <ImageSlider
        images={[
          handmadeImages[(parseInt(id) + 0) % handmadeImages.length],
          handmadeImages[(parseInt(id) + 1) % handmadeImages.length],
          handmadeImages[(parseInt(id) + 2) % handmadeImages.length],
        ]}
        title={article.title}
        subtitle={article.body.slice(0, 80) + '...'}
        date="October 01, 2023"
        author={{
          name: 'Jane Smith',
          image: 'https://randomuser.me/api/portraits/women/45.jpg',
        }}
      />

      {/* Main Content */}
      <div className="bg-[#F5F5F1] text-[#A78074] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-[Playfair_Display] mb-6">{article.title}</h2>
          <p className="text-lg text-black leading-relaxed">{article.body}</p>
        </div>

        {/* Related Articles */}
        <div className="mt-20 max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold mb-8 text-left">You May Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg overflow-hidden border border-[#e5e5e5] shadow-sm hover:shadow-md transition"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-md font-semibold mb-1 text-[#4b3832]">{item.title}</h4>
                  <p className="text-sm line-clamp-2 text-[#7e6b64]">{item.body}</p>
                  <Link
                    to={`/journal/${item.id}`}
                    className="inline-block mt-3 px-4 py-1 text-sm bg-[#A78074] text-white rounded hover:bg-white hover:text-[#A78074] border border-[#A78074] transition"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-white mt-16 rounded-lg shadow-md px-6 py-12 text-center">
        <Newsletter />
      </div>

    
    </>
  );
};

export default Article;
