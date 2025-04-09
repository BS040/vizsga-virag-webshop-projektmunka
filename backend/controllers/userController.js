import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";
import crypto from "crypto"
import nodemailer from 'nodemailer'





const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

//Email küldése regisztrációkor
const sendRegistrationEmail = (email, name) => {

    const redirectLink = "vizsga-virag-frontend.vercel.app"; //Mivel az alkalmazás már deployolva van, a linket vercelben adtam meg és ezért az emailen keresztül már megnyitható

    const mailOptions = {
        from: process.env.EMAIL_USER, // Az email cím, amelyről az üzenetet küldöd
        to: email,
        subject: 'Sikeres regisztráció',
        html: `
          <p>Kedves ${name},</p>
          <p>Sikeresen regisztráltál a weboldalunkra! Üdvözlünk!</p>
          <p>Kattints az alábbi gombra, hogy átirányítson a weboldalunkra:</p>
          <a href="${redirectLink}" style="
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 14px 20px;
            text-decoration: none;
            font-size: 16px;
            border-radius: 5px;
          ">Lépj a weboldalra</a>
          <p>Köszönjük, hogy minket választottál!</p>
        `
      };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Email küldés hiba:', error);
      } else {
        console.log('Email elküldve: ' + info.response);
      }
    });
  };

// Visszaadja az adott user adatait
const getUserDetails = async (req, res) => {
    try {
      const user = await userModel.findById(req.body.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "Felhasználó nem található" });
      }
      res.json({ success: true, user: { email: user.email, name: user.name } });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  export { getUserDetails };
  

// User belépés útvonala
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "A felhasználó nem létezik" })
        }

        if (user.status === 'inactive') {
            return res.json({ success: false, message: 'A felhasználó inaktiválva van, vedd fel a kapcsolatot az adminisztrátorral a feloldáshoz!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token })

        }
        else {
            res.json({ success: false, message: 'A jelszó vagy e-mail helytelen' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}



//Email küldése regisztrációkor
// User Regisztráció útvonala
const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // ellenőrzés hogy a felhasználó már rendelkezik e fiokkal vagy nem

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "A felhasználó már létezik" })
        }

        //email validálása és hogy a jelszó erős legyen 
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Kérlek érvényes e-mailt adj meg!" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Kérlek adj meg legalább egy erős minősítésű jelszót!" })
        }

        //felhasználok jelszava
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

        sendRegistrationEmail(email, name);



    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, 'name email status'); // Csak a name és email mezőket kérjük
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Ellenőrizzük, hogy a felhasználó létezik-e
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Felhasználó nem található' });
        }

        // A státuszt állítjuk, ha aktív, akkor inaktívra állítjuk, ha inaktív, akkor visszaállítjuk aktívra
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        user.status = newStatus;

        await user.save();

        res.json({ success: true, message: `Felhasználó státusza sikeresen ${newStatus === 'inactive' ? 'inaktiválva' : 'visszaállítva'}` });
    } catch (error) {
        console.error('Hiba a felhasználó státuszának módosításakor:', error);
        res.status(500).json({ success: false, message: 'Szerver hiba a státusz módosítása során' });
    }
};




//Útvonal az admin regisztrációra
const adminLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "E-mail cím vagy jelszó helytelen" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//Az elfelejtett jelszó tervezete
// const forgotPassword = async (req, res) => {
//     const { email } = req.body;
//     try {
//         const user = await userModel.findOne({ email });
//         if (!user) return res.status(404).json({ message: 'Felhasználó nem található.' });

//         //Egyedi token generálás
//         const resetToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});

//         const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;

//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: 'Jelszó visszaállítás',
//             html: `<p>Kedves ${user.name},</p>
//             <p>A jelszó visszaállításhoz kattints az alabbi linkre:</p>
//             <a href="${resetUrl}">${resetUrl}</a>
//             <p>Ha nem kérted ezt a jelszó visszaállítást, kérlek ne vedd figyelembe ezt az emailt.</p>`,
//         };

//         await transporter.sendMail(mailOptions);

//         res.json({ success: true, message: 'Jelszó visszaállítás email elküldve.' });
//     } catch (error) {
//         res.status(500).json({ message: 'Hiba történt!' });
//         }
//     };


// Új jelszó mentésének tervezete
// const resetPassword = async (req, res) => {
//     const { token } = req.params;
//     const { newPassword } = req.body;

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await userModel.findById(decoded.id);

//         if (!user) return res.status(404).json({ message: 'Felhasználó nem található.' }); 

//         const hashedPassword = await bcrypt.hash(newPassword, 10);
//         user.password = hashedPassword;
//         await user.save();

//         res.json({ success: true, message: 'Jelszó sikeresen visszaállítva.' });
//     } catch (error) {
//         res.status(400).json({ message: 'Hiba történt!' });
//     }
// };


export { loginUser, registerUser, adminLogin, getAllUsers, deactivateUser, sendRegistrationEmail };
