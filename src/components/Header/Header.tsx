
const headerStyles = {
    display: 'flex',
    height: '40px',
    backgroundColor: '#5181b8',
    color: '#fff',
    padding: '12px',
    marginBottom: '16px',
    borderRadius: '8px',
    alignItems: 'center'
};

const badgeStyles = {
    backgroundColor: '#fff',
    color: '#5181b8',
    padding: '4px 8px',
    borderRadius: '5px',
    marginRight: '8px'
};

function Header() {
    return (
        <div style={headerStyles}>
            <h5 style={{ margin: '0', fontWeight: 'bold', fontSize: '30px' }}>
                <span style={badgeStyles}>В</span>
                Контакте
            </h5>
        </div>
    );
}

export default Header;
