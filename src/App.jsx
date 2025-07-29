import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from 'react';
import SplashScreen from './Components/SplashScreen/SplashScreen' 
import useMessageNotification from './hooks/useMessageNotification';
import Hero from './Components/Hero/Hero';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import AboutUs from './Components/AboutUs/AboutUs';
import Footer from './Components/Footer/Footer';
import Article from './Components/Article/Article';
import Journal from './Components/Journal/Journal';
import FeaturedProducts from './Components/FeaturedProducts/FeaturedProducts';
import Testimonials from './Components/Testimonials/Testimonials';
import Services from './Components/Services/Services';
import VendorForm from './Components/VendorForm/VendorForm';
import HomeUser from './Components/HomeUser/HomeUser';
import VendorHome from './Components/VendorHome/VendorHome';
import UserFavorite from './Components/UserFavorite/UserFavorite';
import UserCart from './Components/UserCart/UserCart';
import UserProducts from './Components/UserProducts/UserProducts';
import ProductDetails from './Components/ProductDetails/ProductDetails';
import ProductDetail from './Components/UserProducts/ProductDetail';
import VendorProfile from './Components/VendorProfile/VendorProfile';
import CustomerVendorChat from './Components/CustomerVendorChat/CustomerVendorChat';
import VendorChatsPage from './Components/VendorChatsPage/VendorChatsPage';
import ChatRoom from './Components/ChatRoom/ChatRoom';
import VendorFavorite from './Components/VendorFavorite/VendorFavorite';
import VendorCart from './Components/VendorCart/VendorCart';
import VendorProductsApproved from './Components/VendorProductsApproved/VendorProductsApproved';
import VendorProductDetails from './Components/VendorProductDetails/VendorProductDetails';
import Showvendorproduct from './Components/Showvendorproduct/Showvendorproduct';
import VendorChatPage from './Components/VendorChatPage/VendorChatPage';
import Checkout from './Components/Checkout/Checkout';
import PaymentSuccess from './Components/Success/PaymentSuccess';
import UserOrders from './Components/UserOrders/UserOrders';
import UserOrderDetails from './Components/UserOrderDetails/UserOrderDetails';
import Vendors from './Components/Vendors/Vendors';
import CustomerChats from './Components/CustomerChats/CustomerChats';
import UserProfile from './Components/UserProfile/UserProfile';
import FeedbackForm from './Components/FeedbackForm/FeedbackForm';
import Overview from './pages/Overview';
import AdminProducts from './pages/AdminProducts';
import Users from './pages/Users';
import Vendor from './pages/Vendor';
import Orders from './pages/Orders';
import Feedback from './pages/Feedback';
import Complaint from './pages/Complaint';
import Reviews from './pages/Reviews';
import CheckoutVendor from './Components/CheckoutVendor/Checkout';
import VendorSuccess from './Components/VendorSuccess/VendorSuccess';
import VendorOrders from './Components/VendorOrders/VendorOrders';
import VendorOrderDetails from './Components/VendorOrderDetails/VendorOrderDetails';
import VendorPage from './Components/VendorPage/VendorPage';
import UserNotification from './Components/UserNotification/UserNotification';
import VendorNotifications from './Components/VendorNotifications/VendorNotifications'
import ProtectedRoute from './ProtectRoute/ProtectedRoute';
import NotFound from './Components/NotFound/NotFound';
import VendorDetails from './Components/VendorHome/VendorDetails'
import OurTeam from './Components/OurTeam/OurTeam'
function App() {
  const [loading, setLoading] = useState(true);
  useMessageNotification();
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <AnimatePresence mode="wait">
        <SplashScreen key="splash" />
      </AnimatePresence>
    );
  }

  return (
    <>
      
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:id" element={<Article />} />
        <Route path="/products" element={<FeaturedProducts />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/services" element={<Services />} />
        <Route path="/team" element={<OurTeam />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vendorform" element={<VendorForm />} />
        <Route path="/homeuser" element={ <ProtectedRoute><HomeUser /></ProtectedRoute>} />
        <Route path="/userproducts" element={<ProtectedRoute><UserProducts /></ProtectedRoute>} />
        <Route path="/userproducts/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
        <Route path="/userfavorite" element={<ProtectedRoute><UserFavorite /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/userorders" element={<ProtectedRoute><UserOrders /></ProtectedRoute>} />
        <Route path="/orders/:orderId" element={<ProtectedRoute><UserOrderDetails /></ProtectedRoute>} />
        <Route path="/feedback/:orderId/:productId" element={<ProtectedRoute><FeedbackForm /></ProtectedRoute>} />
        <Route path='usernotification' element={<ProtectedRoute><UserNotification/></ProtectedRoute>}/>
        <Route path='/vendors' element={<ProtectedRoute><Vendors/></ProtectedRoute>} />
        <Route path='/productDetails/:id' element={<ProtectedRoute><VendorDetails></VendorDetails></ProtectedRoute> } />
        <Route path="/paymentsuccess" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
        <Route path="/customerchats" element={<ProtectedRoute><CustomerChats /></ProtectedRoute>} />
        <Route path="/userprofile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/vendors/:vendorId" element={<ProtectedRoute><VendorProfile /></ProtectedRoute>} />
       
        <Route path="/chat/:chatId" element={<ProtectedRoute><CustomerVendorChat /></ProtectedRoute>} />
        <Route path="/chat/:chatId" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
        <Route path="/vendor/chats" element={<ProtectedRoute><VendorChatsPage /></ProtectedRoute>} />
        <Route path="/vendor/chat/:chatId" element={<ProtectedRoute><VendorChatPage /></ProtectedRoute>} />
        <Route path="/vendor/orders" element={<ProtectedRoute><VendorOrders /></ProtectedRoute>} />
        <Route path="/vendor/orders/:orderId" element={<ProtectedRoute><VendorOrderDetails /></ProtectedRoute>} />
        <Route path="/vendor/:vendorId" element={<ProtectedRoute><VendorPage /></ProtectedRoute>} />

        <Route path="/vendor/favorites" element={<ProtectedRoute><VendorFavorite /></ProtectedRoute>} />
        <Route path="/vendor/cart" element={<ProtectedRoute><VendorCart /></ProtectedRoute>} />
        <Route path="/checkoutvendor" element={<ProtectedRoute><CheckoutVendor /></ProtectedRoute>} />
        <Route path="/paymentsuccessvendor" element={<ProtectedRoute><VendorSuccess /></ProtectedRoute>} />
        <Route path="/vendor/approvedproduct" element={<ProtectedRoute><VendorProductsApproved /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><UserCart /></ProtectedRoute>} />
        <Route path="/vendorhome" element={<ProtectedRoute><VendorHome /></ProtectedRoute>} />
        <Route path='/vendornotification' element={<ProtectedRoute><VendorNotifications/></ProtectedRoute>} />
        <Route path="/vendorproduct/:id" element={<ProtectedRoute><VendorProductDetails /></ProtectedRoute>} />
        
        <Route path='/vendor/showvendorproduct' element={<ProtectedRoute><Showvendorproduct /></ProtectedRoute>} />
        <Route path='/admin/overview' element={<ProtectedRoute><Overview /></ProtectedRoute>} />
        <Route path='/admin/products' element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
        <Route path='/admin/users' element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path='/admin/vendor' element={<ProtectedRoute><Vendor /></ProtectedRoute>} />
        <Route path='/admin/orders' element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path='/admin/feedback' element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
        <Route path='/admin/complaint' element={<ProtectedRoute><Complaint /></ProtectedRoute>} />
        <Route path='/admin/reviews' element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
  
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <Toaster position="top-center" />
   </>
  );
}

export default App;
