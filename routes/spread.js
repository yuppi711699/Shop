const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
  res.render('spread', {
    title: 'Ожидающие',
    // isHome: true
  })
})


module.exports = router