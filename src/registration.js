import express from 'express';
import { insert } from './db.js'

export const router = express.Router();

//posta formi á síðu
function form(req, res) {
  const data = {
    title: 'Undirksriftarlisti',
    named: '',
    id:  '',
    remark: '',
    noName: '',
    errors: [],
  };

  res.render('form', data);
}

//pusha útfylltu formi í db
async function formPost(req, res) {
  const {
    body: {
      named = '',
      id = '',
      remark = '',
      noName = '',
    } = {},
  } = req;

  const data = {
    named,
    id,
    remark,
    noName,
  };

  await insert(data);

  return res.redirect('/');
}

router.get('/', form);
