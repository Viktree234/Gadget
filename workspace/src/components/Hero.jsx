import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>THE FUTURE OF SOUND.<br />NOW IN YOUR EARS</h1>
          <button className="btn-primary">LEARN MORE</button>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" alt="Premium Headphones" />
        </div>
      </div>
    </section>
  )
}

export default Hero
