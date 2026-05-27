import { useNavigate } from 'react-router-dom'
export default function BackButton() {
    const navigate = useNavigate()
  const BackButtonStyle = {
      color: 'black',
      padding: '8px 11px',
      backgroundColor: '#f5d903ff',
      borderRadius: 50,
      transform: 'scale(1.1)',
      maxWidth: 'fit-content',
      margin: '25px 20px',
      float: 'left',
      display: 'flex',
      position: 'fixed',
      top: 0
  };
  return (
    <div>
          <button onClick={() => navigate(-1) ? navigate(-1): navigate('/')} style={BackButtonStyle}>&lt;-</button>
    </div>
  );
}
