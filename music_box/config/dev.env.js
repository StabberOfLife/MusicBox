'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const express = require('express')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})
