import { useState } from "react";
import { Link } from "react-router-dom";
type Props = {
  style: string;
};
type DropdownState = {
  home: boolean;
  pages: boolean;
  shop: boolean;
  blog: boolean;
};
const NavSection = ({ style }: Props) => {
  const [dropdown, setDropdown] = useState<DropdownState>({
    home: false,
    pages: false,
    shop: false,
    blog: false,
  });

  const handleToggleDropdown = (dropdownName: keyof DropdownState) => {
    if (window.innerWidth < 992) {
      setDropdown((prevState) => ({
        ...prevState,
        [dropdownName]: !prevState[dropdownName],
      }));
    }
  };

  return (
    <div className={`rv-1-header__nav ${style}`}>
      <ul className="justify-content-center">
        <li className={dropdown.home ? "rv-dropdown-active" : ""}>
          <Link to="/">Acceuil</Link>
        </li>

        <li>
          <Link to="/market">Marché</Link>
        </li>

        <li className={dropdown.pages ? "rv-dropdown-active" : ""}>
          <a role="button" onClick={() => handleToggleDropdown("pages")}>
            Abonnement
          </a>
          <ul className="sub-menu">
            <li>
              <Link to="/services">Services</Link>
            </li>
            <li>
              <Link to="/services/web-solution">Service Details</Link>
            </li>
            <li>
              <Link to="/projects">Projects</Link>
            </li>
            <li>
              <Link to="/projects/sustainable-planting-drive">
                Project Details
              </Link>
            </li>
            <li>
              <Link to="/team">Team Members</Link>
            </li>
            <li>
              <Link to="/sign-in">Sign In</Link>
            </li>
            <li>
              <Link to="/sign-up">Sign Up</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/wishlist">Wishlist</Link>
            </li>
            <li>
              <Link to="/checkout">Checkout</Link>
            </li>
          </ul>
        </li>

        <li className={dropdown.shop ? "rv-dropdown-active" : ""}>
          <a role="button" onClick={() => handleToggleDropdown("shop")}>
            A propos
          </a>
          <ul className="sub-menu">
            <li>
              <Link to="/shop">Shop</Link>
            </li>
            <li>
              <Link to="/shop-sidebar">Shop with Sidebar</Link>
            </li>
            <li>
              <Link to="/shop/herbal-hair-oil">Product Details</Link>
            </li>
          </ul>
        </li>

        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
    </div>
  );
};

export default NavSection;
