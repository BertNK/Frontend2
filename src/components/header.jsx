import './header.css'

function Header() {
  return (
    <div className="Header">
      <div className="leftHeader">
        <img className='logo' src="/EatCheap.png"/>
      </div>

      <div className="middleHeader">

      </div>

      <div className="rightHeader">
        <img className='loginIcon' src="/loggedout.png"/>
      </div>
    </div>
  )
}

export default Header;
