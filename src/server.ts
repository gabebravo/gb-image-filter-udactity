import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  app.get('/filteredimage', async (req, res, next) => {
    const { image_url } = req.query; // get string query param
    if (!image_url) {
      // check image_url is valid
      return res
        .status(400) // return error message
        .send({ message: 'image url is required or malformed' });
    }
    // get the filteredpath
    const filteredpath = await filterImageFromURL(image_url);
    res.locals.filteredpath = filteredpath; // pass filteredpath to middleware
    res.sendFile(filteredpath); // send the file back in the response
    next(); // trigger middleware
  });

  app.use(async (req, res) => {
    // must run a timeout to wait for the previous file to finish writing
    setTimeout(function() {
      deleteLocalFiles([res.locals.filteredpath]); // fire the delete util
    }, 1500);
  });

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get('/', async (req, res) => {
    res.send('try GET /filteredimage?image_url={{}}');
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
