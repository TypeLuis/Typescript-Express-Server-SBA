### API-KEYS TS Setup
- To add something to the req.body object, you would have to create a `express.d.ts` file and add the following content inside. since we need a "key" key this is how we apply the key to the body object without getting a type error.
- Can add other key value pairs if nessecary 
```
import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    key?: string;
  }
}

```