import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addBill } from '../../data/store'

export default function AddBill() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [image, setImage] = useState(null)
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  )

  const handleCapture = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
  addBill({
    supplierId: id,   // 🔥 IMPORTANT
    image,
    date,
  })

  navigate(-1)
}

  return (
    <div style={{ padding: '16px' }}>
      <h2>Capture Bill</h2>

      {/* Camera */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
      />

      {/* Preview */}
      {image && (
        <img
          src={image}
          alt="bill"
          style={{ width: '100%', marginTop: '10px', borderRadius: '10px' }}
        />
      )}

      {/* Date Picker */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ width: '100%', marginTop: '15px', padding: '10px' }}
      />

      <button
        onClick={handleSave}
        style={{
          width: '100%',
          marginTop: '15px',
          padding: '12px',
          background: '#1e88e5',
          color: '#fff',
          border: 'none',
          borderRadius: '8px'
        }}
      >
        Save Bill
      </button>
    </div>
  )
}