
# Export API

## About
The purpose of this API consists to query a `dataset`  + some filtering, and output it to a HTTP response into a given `format`.

### Stack
- node 14.4
- yarn 1.22
- NestJS 7.6.15
- Prisma 2.21

...but all this stuff is described in Dockerfile

## Models 

Main models to figure out :

`Dataset`
A Dataset fetch Orders, or Validation, or any via a ORM, with a prebuild Query.
You are free to add as many Dataset as you need. Things are designed this way.
Some will fit most customers' need, other will be more specific. 
So we can tell that many Dataset can be expected to be added over time

`Formatter`
A Formatter is a one-class function that takes a Dataset as input and outputs it to a given specific format, be it CSV, XML, CSV Zipped, ...
As well as Dataset, you are free to add as many Formatters as you need. Things are designed this way.
But few new formatters might be added over time.

 `IDataset`
Interface that specifies how to implement *fetch()* method

`IFormatter`
Interface that specifies how to implement *format()* method

`Snapshot`
represent a rather abstract collection of objects: records, aggregates, ...


## Architecture

The export API est is organized as follows : 

`src/api-rest`
- controllers, 
- pipes,
- swagger config (openAPI)

`src/common`
- db config and ORM service
- embeds core models

`src/datasets`
stuff that specify and run datasets

`src/datasets/datasets`
contains all dataset files available for querying

`src/formatters`
stuff that specify and run formatters

`/src/formatters/formatters`
contains all formatter files available to output a dataset payload


## How to create a new Dataset

A Dataset is technically a NestJS Service that respect a given interface and hold some metadata for being identified
You can inspire from a existing Dataset class to duplicate its skeleton

Herebelow you have 4 mandatory steps to follow :
1. auto-generate a NestJS sevice class
2. identity the service with a Decorator
3. implement the fetch() method
4. Add the service to its folder's index

#### Schematic
In a future version, we can plan to write a schematic that help create a new dataset with just a single NestJS CLI command, instead of 4 manual steps.

### 1. Auto generate a NestJS service class

    $ nest g service datasets/datasets/mystuff --flat   
Add a "**.dataset**" suffix to the generated .ts file, so that the file has a standardized naming : 

    mystuff.dataset.ts

### 2. Make the service identifiable
NestJS will mount the service inside a discoverable Service Registry.
So it must supply metadata so as to be identifiable and retrieved.

    # src/datasets/datasets/somestuff.dataset.ts
    
    const decorator = {
        id: "my-stuff",
        description: "retrieves some kind of stuff"
    };

    @Injectable()
    **@DatasetDecorator(decorator)**
	export class MyDataset extends IDataset {
		constructor(){
			super(decorator.id);
		}
	}

You can also add a optional prop `filterables` to the decorator : it will whitelist only the subset of props (fields) that are allowed to have filters be applied on .
If not set, all props are whitelisted.

### 3. Implement the fetch() method 
Let be guided with the abstract class `IDataset` from common
   
	# src/datasets/datasets/somestuff.dataset.ts
	
	@Injectable()
    @DatasetDecorator(decorator)
    export class MyDataset extends IDataset {
		async  **fetch**(
			options:  IDatasetFetchOptions<OrdersDatasetFilters>,
		):  Promise<Snapshot> {
			...
		}
	}
#### 3.1. Implement the fetchAsStream() method
Not mandatory right now. Can be done later.
In case of large volume of data, you cannot store the data as a big Buffer into a simple var.
That would overflow the storage limit of this var as well as crashing the server.
It must be handled as a *stream*.
To do so you must split the bulk : paginate the result with Prisma, push the chunks as they arrive into a Readable stream. Then the stream should be passed to formatter.formatAsync()...
...well, you better watch the example of  `orders.dataset.ts`

### 4. Add the service to its folder's index

#### with IDE extension :
Either you have [generate-file](https://marketplace.visualstudio.com/items?itemName=kingdaro.generate-index) VS-code extension :
from the service file opened : Ctrl +Shift + P > "Generate / update index file"
that will add the current file to the `index.ts` file in the same folder.
Then the NestJS Discovery Service loads all files from the index.ts
(/datasets/datasets/index.ts)

#### or manually :    
Or add manually the file path to the index.ts file : 

    # src/datasets/datasets/index.ts
    ...
    export * from "./my-stuff.dataset";

## How to create a new Formatter

As well as Dataset, a Formatter is technically a NestJS Service that respect a given interface and hold some metadata for being identified
You can inspire from a existing Dataset class to duplicate its skeleton

Herebelow you have 4 mandatory steps to follow :
1. auto-generate a NestJS sevice class
2. identity the service with a Decorator
3. implement the format() method
4. Add the service to its folder's index

#### Schematic
In a future version, you can plan to write a schematic that help create a new formatter with just a single NestJS CLI command, instead of 4 manual steps.

### 1. Auto generate a NestJS service class

    $ nest g service formatters/formatters/anyformat --flat   
Add a "**.formatter**" suffix to the generated .ts file, so that the file has a standardized naming : 

    anyformat.formatter.ts

### 2. Make the service identifiable
NestJS will mount the service inside a discoverable Service Registry.
So it must supply metadata so as to be identifiable and retrieved.

    # src/datasets/datasets/somestuff.dataset.ts
    
    const decorator = {
        id: "anyformat",
        description: "a simple XYZ formatter"
    };

    @Injectable()
    **@FormatterDecorator(decorator)**
	export class AnyFormatter extends IFormatter {
		constructor(){
			super(decorator.id);
		}
	}

Inside this service you can leverage any NPM package you need to handle the formatting.
Keep in mind to install TypeScript defs that be brought with it  (if any).

### 3. Implement the format() method 
Let be guided with the abstract class `IDataset` from common
   
	# src/datasets/datasets/somestuff.dataset.ts
	
	@Injectable()
    @DatasetDecorator(decorator)
    export class MyDataset extends IDataset {
		format(data:  Snapshot, options?:  Options<string>):  IFormatterFormat {
			...
		}
	}
#### 3.1. Implement de formatAsync() method
Not mandatory right now. Can be done later.
This is the *stream* adapted version of the `format()` method for case of large volume data passed.
The IFormatter interface asks for 2 inputs : a Readable as source, a Writable as output.
Usually :
- the `Readable` source is the data payload from Prisma DB embedded into a Stream
- the `Writable` output is the Express Response


### 4. Add the service to its folder's index

#### with IDE extension :
Either you have [generate-file](https://marketplace.visualstudio.com/items?itemName=kingdaro.generate-index) VS-code extension :
from the service file opened : Ctrl +Shift + P > "Generate / update index file"
that will add the current file to the `index.ts` file in the same folder.
Then the NestJS Discovery Service loads all files from the index.ts
(/datasets/datasets/index.ts)

#### or manually :    
Or add manually the file path to the index.ts file : 

    # src/datasets/datasets/index.ts
    ...
    export * from "./my-stuff.dataset";



## Check that Rest API is up-to-date

### Run the server :
    $ yarn start:dev

### Go to API endpoint that lists all datasets up :
[http://localhost:3000/datasets](http://localhost:3000/datasets)
`my-stuff` should be available as part of the collection

Same goes for a new formatter : 
[http://localhost:3000/formats](http://localhost:3000/formats)

## Swagger (openAPI) documentation of Rest API

### API Documentation is available here : 
[http://localhost:3000/api-doc](http://localhost:3000/api-doc)
