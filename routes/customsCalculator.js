const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
  res.render('customscalculator', {
    title: 'Калькулятор таможни',
    isHome: true
  })
})


module.exports = router