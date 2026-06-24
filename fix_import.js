const content = `import CollectionCard from '../../components/CollectionCard/CollectionCard';
import './FeaturedCollections.css';

const FeaturedCollections = () => {
  const collections = [
    {
      id: 1,
      name: "Victorian Elegance",
      image: "https://images.unsplash.com/photo-1566479179817-c0ae09d40988?w=600&h=400&fit=crop",
      description: "Corsets, dresses, and accessories inspired by the Victorian era."
    },
    {
      id: 2,
      name: "Dark Romance",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      description: "Lace, velvet, and silk for a romantic yet gothic look."
    },
    {
      id: 3,
      name: "Occult Jewelry",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop",
      description: "Rings, necklaces, and bracelets with occult symbols and gemstones."
    }
  ];

  return (
    <section className="featured-collections section">
      <div className="container">
        <h2>Featured Collections</h2>
        <div className="bento-grid">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;`;

fetch('http://localhost:3000/update-files', {
  method: 'PATCH',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    updates: [
      {
        file: 'src/sections/FeaturedCollections/FeaturedCollections.jsx',
        content: content
      }
    ]
  })
}).then(r => r.text()).then(console.log).catch(console.error);
