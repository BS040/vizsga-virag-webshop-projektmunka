import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Login = () => {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [currentState, setCurrentState] = useState('Bejelentkezés');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [strengthClass, setStrengthClass] = useState('');
  const [strengthWidth, setStrengthWidth] = useState(0); // Erősség szélessége
  const [passwordChecks, setPasswordChecks] = useState({ length: false, hasLowerCase: false, hasUpperCase: false, hasNumbers: false, hasSpecialChars: false });
  // const [resetPasswordEmail, setResetPasswordEmail] = useState('');

  const apiBaseUrl = backendUrl.endsWith('/') ? backendUrl : `${backendUrl}/`;

  useEffect(() => {
    if (token || localStorage.getItem('token')) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (currentState === 'Bejelentkezés') {
      // Ha bejelentkezésre vált, akkor kiürül a jelszó és a jelszó megerősítés
      setPassword('');
      setConfirmPassword('');
      setEmail('');
    }else if (currentState === 'Regisztráció') {
      setPassword('');
      setConfirmPassword('');
      setEmail('');
      setName('');
    }
    // else if (currentState === 'Elfelejtett jelszó') {
    //   setResetPasswordEmail('');
    // }
  }, [currentState]);

  const checkPasswordStrength = (password) => {
    const length = password.length;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setPasswordChecks({ length, hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChars });

    if (length < 8) {
      setPasswordStrength('Gyenge');
      setStrengthClass('bg-red-500');
      setStrengthWidth(25); // Gyenge: 25% szélesség
    } else if (hasLowerCase && hasUpperCase && hasNumbers && hasSpecialChars) {
      setPasswordStrength('Kiváló');
      setStrengthClass('bg-green-700');
      setStrengthWidth(100); // Kiváló: 100% szélesség
    } else if (hasLowerCase && hasUpperCase && hasNumbers) {
      setPasswordStrength('Erős');
      setStrengthClass('bg-green-400');
      setStrengthWidth(75); // Erős: 75% szélesség
    } else {
      setPasswordStrength('Közepes');
      setStrengthClass('bg-yellow-500');
      setStrengthWidth(50); // Közepes: 50% szélesség
    }
  };

  // const handleForgotPassword = async () => {
  //   try {
  //     const response = await axios.post(`${apiBaseUrl}api/user/forgot-password`, { email: resetPasswordEmail });
  //     if (response.data.success) {
  //       toast.success('A jelszó visszaállítás elküldve.');
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error('Hiba:', error.response?.data || error.message);
  //     toast.error('Hiba történt, próbáld újra!');
  //   }
  // };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!apiBaseUrl) {
      console.error("Hiba: A backend URL nincs beállítva!");
      alert("Szerverhiba! Próbáld újra később.");
      return;
    }

    

    if (currentState === 'Regisztráció'){
    if (passwordStrength === 'Gyenge' || passwordStrength === 'Közepes') {
      toast.error("Kérlek adj meg legalább egy erős minősítésű jelszót!");
      return;
    }
    
      if (password !== confirmPassword) {
        toast.error("A jelszavak nem egyeznek meg!");
        return;
      }

      try {
        const response = await axios.post(`${apiBaseUrl}api/user/register`, { name, email, password });

        if (response.data.success) {
          toast.success('Sikeres regisztráció! Most jelentkezz be.');
          setCurrentState('Bejelentkezés');
        } else {
          toast.error(response.data.message || 'Ismeretlen hiba történt a regisztráció során.');
        }
      } catch (error) {
        console.error('Regisztrációs hiba:', error.response?.data || error.message);
        toast.error(`Hiba történt, próbáld újra! (${error.response?.data?.message || error.message})`);
      }
    } 

    // else if (currentState === 'Elfelejtett jelszó') {
    //   try {
    //     const response = await axios.post(`${apiBaseUrl}api/user/forgot-password`, { email: resetPasswordEmail });
    //     if (response.data.success) {
    //       toast.success('A jelszó visszaállítás elküldve.');
    //     } else {
    //       toast.error(response.data.message) || 'Ismeretlen hiba történt a jelszó visszaállítás során.';
    //     }
    //   } catch (error) {
    //     console.error('Jelszó visszaállítási hiba:', error.response?.data || error.message);
    //     toast.error(`Hiba történt, próbáld újra! (${error.response?.data?.message || error.message})`);
    //   }
    // }

    else {
      try {
        const response = await axios.post(`${apiBaseUrl}api/user/login`, { email, password });

        if (response.data.token) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Bejelentkezési hiba:', error.response?.data || error.message);
        toast.error(`Hiba történt, próbáld újra! (${error.response?.data?.message || error.message})`);
      }
    }
  };

  const CheckIcon = ({ condition }) => (
    condition ? <FaCheckCircle className='text-green-500 mr-2' /> : <FaTimesCircle className='text-red-500 mr-2' />
  );

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='flex flex-col items-center gap-2 mb-2 mt-10'>
        <p className='lexend-deca text-3xl'>{currentState}</p>
        <hr className='border-none w-20 sm:w-20 h-[2px] w-20 bg-gray-800' />
      </div>

      {currentState === 'Bejelentkezés' || currentState === 'Regisztráció' ? (
        <>
          {currentState === 'Regisztráció' && (
            <input
            onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className='w-full px-3 py-2 border border-gray-800'
          placeholder='Teljes név'
          onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-záéíóúőüöÁÉÍÓÚŐÜÖ ]/g, '')}
          required
        />
      )}

      <input 
      onChange={(e) => setEmail(e.target.value)} 
      value={email} 
      type="email" 
      className='w-full px-3 py-2 border border-gray-800' 
      onInput={(e) => e.target.value = e.target.value.replace(/\s+/g, '')}
      placeholder='E-mail cím' 
      required 
      />

      <div className='relative w-full'>
        <input
          onChange={(e) => {
            setPassword(e.target.value);
            checkPasswordStrength(e.target.value);  // Erősség ellenőrzése
          }}
          value={password}
          type={showPassword ? 'text' : 'password'}
          className='w-full px-3 py-2 border border-gray-800'
          placeholder='Jelszó'
          onInput={(e) => e.target.value = e.target.value.replace(/\s+/g, '')}
          required
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {/* {password && (
        <div className='w-full'>
          <p className='text-xs text-gray-600 mb-1'>{passwordStrength}</p>
          <div className={`h-2 ${strengthClass}`} style={{ width: `${strengthWidth}%` }}></div>
          <ul className='text-xs mt-2'>
            <li className='flex items-center'><CheckIcon condition={passwordChecks.length} /> Legalább 8 karakter</li>
            <li className='flex items-center'><CheckIcon condition={passwordChecks.hasLowerCase} /> Kisbetű</li>
            <li className='flex items-center'><CheckIcon condition={passwordChecks.hasUpperCase} /> Nagybetű</li>
            <li className='flex items-center'><CheckIcon condition={passwordChecks.hasNumbers} /> Szám</li>
            <li className='flex items-center'><CheckIcon condition={passwordChecks.hasSpecialChars} /> Speciális karakter</li> 
          </ul>
        </div>
      )} */}

      {/* Jelszó erősség státusz és csík */}
      {/* {currentState === 'Regisztráció' && password && (
        <div className='w-full mb-1'>
          <div className='flex justify-between'>
            <p className='mb-0.5 text-xs text-left text-gray-600'>{passwordStrength}</p>
          </div>
          <div
            className={`h-2 ${strengthClass}`}
            style={{ width: `${strengthWidth}%`, borderRadius: 0 }} // Szögletes csík
          ></div>
        </div>
      )} */}

      {currentState === 'Regisztráció' && password && (
          <div className='w-full'>
            <p className='text-xs text-gray-600 mb-1'>{passwordStrength}</p>
            <div className={`h-2 ${strengthClass}`} style={{ width: `${strengthWidth}%` }}></div>
            <ul className='text-xs mt-2'>
              <li className='flex items-center'><CheckIcon condition={passwordChecks.length} /> Legalább 8 karakter</li>
              <li className='flex items-center'><CheckIcon condition={passwordChecks.hasLowerCase} /> Kisbetű</li>
              <li className='flex items-center'><CheckIcon condition={passwordChecks.hasUpperCase} /> Nagybetű</li>
              <li className='flex items-center'><CheckIcon condition={passwordChecks.hasNumbers} /> Szám</li>
              <li className='flex items-center'><CheckIcon condition={passwordChecks.hasSpecialChars} /> Speciális karakter</li> 
            </ul>
          </div>
        )}

      {currentState === 'Regisztráció' && (
        <div className='relative w-full'>
          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            type={showConfirmPassword ? 'text' : 'password'}
            className='w-full px-3 py-2 border border-gray-800'
            onInput={(e) => e.target.value = e.target.value.replace(/\s+/g, '')}
            placeholder='Jelszó megerősítése'
            required
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      )}
      </>
      ) : null}
       {/* currentState === 'Elfelejtett jelszó' ? (
        <>
          <input
            onChange={(e) => setResetPasswordEmail(e.target.value)}
            value={resetPasswordEmail}
            type="email"
            className='w-full px-3 py-2 border border-gray-800'
            placeholder='Add meg az emailcímet'
            onInput={(e) => e.target.value = e.target.value.replace(/\s+/g, '')}
            required
          />
        
      <div className='relative w-full'>
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type={showPassword ? 'text' : 'password'}
          className='w-full px-3 py-2 border border-gray-800'
          placeholder='Új Jelszó'
          onInput={(e) => e.target.value = e.target.value.replace(/\s+/g, '')}
          required
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <div className='relative w-full'>
        <input
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          type={showConfirmPassword ? 'text' : 'password'}
          className='w-full px-3 py-2 border border-gray-800'
          onInput={(e) => e.target.value = e.target.value.replace(/\s+/g, '')}
          placeholder='Jelszó megerősítése'
          required
      />
        <span
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'>
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      </>
      )  */}

      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        {currentState === 'Elfelejtett jelszó' ? (
          {/* <p onClick={() => setCurrentState('Bejelentkezés')} className='cursor-pointer text-center w-full mt-1'>Vissza a Bejelentkezéshez</p> */}
        ) : currentState === 'Bejelentkezés' ? (
        <>
         {/*<p className='cursor-pointer mt-1' onClick={() => {setCurrentState('Elfelejtett jelszó')}}>Elfelejtett jelszó</p>*/}
          <p onClick={() => setCurrentState('Regisztráció')} className='cursor-pointer text-center w-full mt-1'>
          <span className="hover:bg-black hover:text-white px-1 inline-block transition-all duration-300">
                  Nincs fiókod? Regisztrálj itt!
              </span>
            </p>
        </>
        ) : (
          <p onClick={() => setCurrentState('Bejelentkezés')} className='cursor-pointer text-center w-full mt-1'>
          <span className="hover:bg-black hover:text-white px-1 inline-block transition-all duration-300">
                  Vissza a Bejelentkezéshez
              </span>
            </p>
        )}
        </div>
        
      <button className={`bg-black text-white font-light px-8 py-2 mt-2 ${currentState === 'Bejelentkezés' ? 'mb-28' : ''}`}>
          {currentState === 'Bejelentkezés' ? 'Bejelentkezés' : currentState === 'Regisztráció' ? 'Regisztráció' : 'Kérés elküldése'}
      </button>
    </form>
  );
};

export default Login;


<p className='cursor-pointer mt-1' onClick={{/*() => setCurrentState('Elfelejtett jelszó')*/}}>Elfelejtett jelszó</p>

      // Ez a bejelentkezési terület miatt kellet módosítani
     // <button className='bg-black text-white font-light px-8 py-2 mt-4'>
     //    {currentState === 'Bejelentkezés' ? 'Bejelentkezés' : 'Regisztráció'}
     //  </button>
