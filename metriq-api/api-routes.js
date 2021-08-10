// api-routes.js

// Initialize ExpressJS router.
const router = require('express').Router()

// Set default API response.
router.get('/', function (req, res) {
  res.json({
    status: 'API is working',
    message: 'This is the Metriq public REST API.'
  })
})

const accountController = require('./controller/accountController')
const userController = require('./controller/userController')
const submissionController = require('./controller/submissionController')
const tagController = require('./controller/tagController')
const taskController = require('./controller/taskController')
const resultController = require('./controller/resultController')
const methodController = require('./controller/methodController')

// Register routes.
router.route('/register')
  .post(accountController.new)
router.route('/login')
  .post(accountController.login)
router.route('/logout')
  .get(accountController.logout)
router.route('/token')
  .post(accountController.newToken)
  .delete(accountController.deleteToken)
router.route('/recover')
  .post(accountController.recover)
router.route('/password')
  .post(accountController.password)
router.route('/user')
  .get(userController.read)
  .delete(userController.delete)
router.route('/user/submission/:page')
  .get(userController.readSubmissions)
router.route('/submission')
  .post(submissionController.new)
router.route('/submission/:id')
  .get(submissionController.read)
  .post(submissionController.update)
  .delete(submissionController.delete)
router.route('/submission/:id/upvote')
  .post(submissionController.upvote)
router.route('/submission/trending/:page')
  .get(submissionController.trending)
router.route('/submission/popular/:page')
  .get(submissionController.popular)
router.route('/submission/latest/:page')
  .get(submissionController.latest)
router.route('/tag/names')
  .get(tagController.readNames)
router.route('/tag')
  .get(tagController.read)
router.route('/task')
  .post(taskController.new)
router.route('/task/submissionCount')
  .get(taskController.readSubmissionCounts)
router.route('/task/names')
  .get(taskController.readNames)
router.route('/task/:id')
  .get(taskController.read)
  .post(taskController.update)
  .delete(taskController.delete)
router.route('/method')
  .post(methodController.new)
router.route('/method/submissionCount')
  .get(methodController.readSubmissionCounts)
router.route('/method/names')
  .get(methodController.readNames)
router.route('/method/:id')
  .get(methodController.read)
  .delete(methodController.delete)
router.route('/submission/:submissionId/method/:methodId')
  .post(submissionController.newMethod)
  .delete(submissionController.deleteMethod)
router.route('/submission/:submissionId/tag/:tagName')
  .post(submissionController.newTag)
  .delete(submissionController.deleteTag)
router.route('/submission/:submissionId/task/:taskId')
  .post(submissionController.newTask)
  .delete(submissionController.deleteTask)
router.route('/submission/:tag/trending/:page')
  .get(submissionController.tagTrending)
router.route('/submission/:tag/popular/:page')
  .get(submissionController.tagPopular)
router.route('/submission/:tag/latest/:page')
  .get(submissionController.tagLatest)
router.route('/submission/:id/result')
  .post(resultController.new)
router.route('/result/metricNames')
  .get(resultController.readMetricNames)
router.route('/result/:id')
  .delete(resultController.delete)

// Export API routes.
module.exports = router
