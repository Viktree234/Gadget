import { useState, useEffect } from 'react'
import './Categories.css'
import api from '../services/api'

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        const response = await api.getCategories()
        setCategories(response.categories || [])
      } catch (err) {
        console.error('Error fetching categories:', err)
        // Fallback to empty array on error
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="categories">
        <div className="categories-container">
          <p>Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="categories">
      <div className="categories-container">
        {categories.length === 0 ? (
          <p>No categories available</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="category-item">
              <div className="category-icon">{cat.icon}</div>
              <p className="category-name">{cat.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Categories
