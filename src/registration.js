import express from 'express';
import { body, validationResult } from 'express-validator';
import { insert, select } from './db.js';

export const router = express.Router();

function errorCatch(fu) {
  return (req, res, next) => fu(req, res, next).catch(next);
}

function dateFormat(data) {
  data.forEach((d) => {
    const year = d.signed.getFullYear();
    const month = d.signed.getMonth();
    const day = d.signed.getDate();
    d.signed = (`${day}, ${month}, ${year}`);
  });
  return data;
}

const validations = [
  body('name').isLength({ min: 1 }).withMessage('Vinsamlegast skrifaðu nafnið þitt'),

  body('nationalId')
    .isLength(10)
    .withMessage('Vinsamlegast skrifaðu kennitöluna þína'),

  body('anonymous')
    .isBoolean(),
];

// posta formi á síðu
async function form(req, res) {
  const data = await {
    title: 'Undirksriftarlisti',
    name: '',
    nationalId: '',
    comment: '',
    anonymous: '',
    errors: [],
  };

  let table = await select();

  table = dateFormat(table);

  res.render('form', { title: 'Undirskriftir', data, table });
}

async function errors(req, res, next) {
  const {
    body: {
      name = '',
      nationalId = '',
      comment = '',
      anonymous = '',
    } = {},
  } = req;

  const data = await {
    name,
    nationalId,
    comment,
    anonymous,
  };

  let table = await select();

  table = dateFormat(table);

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const errors1 = validation.array();
    data.errors = errors1;

    return res.render('form', { title: 'Daginn', data, table });
  }

  return next();
}

// pusha útfylltu formi í db
async function formPost(req, res) {
  let {
    body: {
      name = '',
      nationalId = '',
      comment = '',
      anonymous = '',
    } = {},
  } = req;

  if (anonymous === 'on') anonymous = true;
  else anonymous = false;

  let data = {
    name,
    nationalId,
    comment,
    anonymous,
  };

  await insert(data);

  return res.redirect('/');
}

router.get('/', form);

router.post('/',
  validations,
  errors,
  errorCatch(formPost));
