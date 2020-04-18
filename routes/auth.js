const {Router} = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')

const sgMail = require('@sendgrid/mail');
const User = require('../models/user')
const keys = require('../keys')
const resetEmail = require('../emails/reset')
const regEmail = require('../emails/registration')

const router = Router()

const transporter = nodemailer.createTransport(sendgrid({
  auth:{api_key : keys.SENDGRID_API_KEY}
}))

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
    isLogin: true,
    registerError: req.flash('registerError'),
    loginError: req.flash('loginError')

  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login')
  })
})

router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body
    const candidate = await User.findOne({ email })

    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password)

      if (areSame) {
        req.session.user = candidate
        req.session.isAuthenticated = true
        req.session.save(err => {
          if (err) {
            throw err
          }
          res.redirect('/')
        })
      } else {
        req.flash('loginError', 'incorrect password')
        res.redirect('/auth/login#login')
      }
    } else {
      req.flash('loginError', 'login is not exist')
      res.redirect('/auth/login#login')
    }
  } catch (e) {
    console.log(e)
  }
})

router.post('/register', async (req, res) => {
  try {
    const {email, password, repeat, name} = req.body
    const candidate = await User.findOne({ email })

    if (candidate) {
      req.flash('registerError', 'email is registred')
      res.redirect('/auth/login#register')
    } else {
      const hashPassword = await bcrypt.hash(password, 10)
      const user = new User({
        email, name, password: hashPassword, cart: {items: []}
      });

      // await sgMail.send(regEmail(email));
      // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      // const msg = {
      //   to: 'test@example.com',
      //   from: 'test@example.com',
      //   subject: 'Sending with Twilio SendGrid is Fun',
      //   text: 'and easy to do anywhere, even with Node.js',
      //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      // };
      // await sgMail.send(msg);
      // sgMail.setApiKey(keys.SENDGRID_API_KEY);
      // const msg = {
      //   to: email,
      //   from: 'test@example.com',
      //   subject: 'Sending with Twilio SendGrid is Fun',
      //   text: 'and easy to do anywhere, even with Node.js',
      //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      // }
      // sgMail.send(msg)
      await transporter.sendMail(//{
        //     to: email,
        //     from: keys.EMAIL_FROM,
        //     subject: 'registration is succses ',
        //     text: 'and easy to do anywhere, even with Node.js',
        //     html: `
        // <h1> Welcome to Shop</h1>
        // <p>Account created on ${email} </p>
        // <hr />
        // <a href="${keys.BASE_URL}">Shop</a>
        // `
        //   }
         regEmail(email)
      )
      await user.save();
      res.redirect('/auth/login#login');
      //
    }
  } catch (e) {
    console.log(e)
  }
})

router.get('/reset', (req,res)=>{
  res.render('auth/reset', {
    title: 'Forget password ?',
    error: req.flash('error')
  })
})
router.post('/reset', (req,res)=>{
  try{
    crypto.randomBytes(32, async (err, buffer)=>{
      if (err) {
        req.flash('error', 'something bed happend')
        return res.redirect('auth/reset')
      }
      const token = buffer.toString('hex')
      const candidate = await User.findOne({email: req.body.email})

      if(candidate){
        candidate.resetToken = token
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
        await  candidate.save()
        await transporter.sendMail(resetEmail(candidate.email, token))
        res.redirect('/auth/login')
      }else {
        req.flash('error', 'email not found')
        res.redirect('/auth/reset')
      }
    })
  }catch (e) {
    console.log(e)
  }
})

router.get('/password/:token', async (req,res)=>{
  if(!req.params.token){
    return res.redirect('/auth/login')
  }
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: {$gt: Date.now()}
    })

    if(!user){
      return res.redirect('/auth/login')
    } else {
      res.render('auth/password', {
        title: 'Recover account',
        error: req.flash('error'),
        userId: user._id.toString(),
        token: req.params.token
      })
    }


  } catch (e) {
    console.log(e)
  }

})
router.post('/password', async (req, res)=>{
  try{
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: {$gt: Date.now()}
    })
    if (user){
      user.password = await bcrypt.hash(req.body.password, 10)
      user.resetToken = undefined
      user.resetTokenExp = undefined
      await user.save()
      res.redirect('/auth/login')
    } else {
      req.flash('loginError', 'Verification time over, please retry reset password')
      res.redirect('/auth/login')
    }

  } catch (e) {
    console.log(e)
  }
})

module.exports = router