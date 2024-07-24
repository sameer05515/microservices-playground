import { useNavigate } from "react-router-dom";

const WelcomeIndex = () => {
    const navigate = useNavigate();
    const styles = {
        container: {
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f0f0f0'
        },
        ul: {
            listStyleType: 'none',
            padding: 0,
        },
        li: {
            margin: '10px 0',
        },
        span: {
            cursor: 'pointer',
            color: 'blue',
            textDecoration: 'none',
            fontWeight: 'bold',
        },
        outletContainer: {
            marginTop: '20px',
        }
    };

    return (
        <div style={styles.container}>
            <ul style={styles.ul}>
                <li style={styles.li}>
                    <span style={styles.span} onClick={() => navigate('old-dashboard')}>ResumeDashboardOld</span>
                </li>
                <li style={styles.li}>
                    <span style={styles.span} onClick={() => navigate('resumes')}>ResumeDashboardNew</span>
                </li>
            </ul>
        </div>
    )
}

export default WelcomeIndex;