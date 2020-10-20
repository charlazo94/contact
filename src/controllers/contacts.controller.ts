import { Request, Response, Router } from 'express';
import { ErrorHandler, handlerError } from '../error';
import auth_token from '../middlewares/auth/auth.midd';
import post_validation from '../middlewares/validators/contact/post';
import put_validation from '../middlewares/validators/contact/put';
import validator from '../middlewares/validator';
import Contact from '../models/contacts';
const router = Router();
// =============================
// @route      GET v1/contacts
// @desc       Get all users contacts
// @access     Private
// =============================
router.get('/', auth_token, async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.find({ user: req.user?.id }).sort({
      date: -1,
    });
    return res.status(200).json({
      data: contacts,
      msj: 'List of contacts',
    });
  } catch (error) {
    const custom = new ErrorHandler(500, 'Server Error');
    handlerError(custom, req, res);
  }
});

// =============================
// @route      POST v1/contacts
// @desc       Add new conctact
// @access     Private
// =============================

router.post('/', auth_token, post_validation, validator, async (req: Request, res: Response) => {
  try {
    const { name, email, phone, type } = req.body;
    const newContact = new Contact({
      name,
      email,
      phone,
      type,
      user: req.user?.id,
    });
    const contact = await newContact.save();
    return res.status(201).json({
      data: contact,
      msj: 'Contact created',
    });
  } catch (error) {
    const custom = new ErrorHandler(500, 'Server Error');
    handlerError(custom, req, res);
  }
});

// =============================
// @route      PUT v1/contacts/:id
// @desc       Update conctact
// @access     Private
// =============================

router.put('/', auth_token, put_validation, validator, async (req: Request, res: Response) => {
  try {
    const { name, email, phone, type } = req.body;
    // Build contact object
    const contactFields: any = {};
    if (name) contactFields.name = name;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;
    if (type) contactFields.type = type;

    let contact = await Contact.findById(req.query.id);

    if (!contact) {
      const custom = new ErrorHandler(404, 'Contact not found');
      handlerError(custom, req, res);
    }
    // One user only can update his constacts
    if (contact?.user.toString() !== req.user?.id) {
      const custom = new ErrorHandler(401, 'Not Authorized');
      handlerError(custom, req, res);
    }
    contact = await Contact.findByIdAndUpdate(
      req.query.id,
      { $set: contactFields },
      { new: true }
    );
    return res.status(200).json({
      data: contact,
      msj: 'Contact updated',
    });
  } catch (error) {
      console.log(error);
    const custom = new ErrorHandler(500, 'Server Error');
    handlerError(custom, req, res);
  }
});

// =============================
// @route      DELETE v1/contacts/:id
// @desc       Delete conctact
// @access     Private
// =============================

router.delete('/:id', auth_token, async (req: Request, res: Response) => {
  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) {
      const custom = new ErrorHandler(404, 'Contact not found');
      handlerError(custom, req, res);
    }
    // One user only can delete his owns constacts
    if (contact?.user.toString() !== req.user?.id) {
      const custom = new ErrorHandler(401, 'Not Authorized');
      handlerError(custom, req, res);
    }
    await Contact.findByIdAndRemove(req.params.id);
    return res.status(200).json({
      data: contact,
      msj: 'Contact Removed',
    });
  } catch (error) {
    const custom = new ErrorHandler(500, 'Server Error');
    handlerError(custom, req, res);
  }
});

export default router;
