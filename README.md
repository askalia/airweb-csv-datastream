
# Export API

The purpose of this API consists to query a `dataset`  + some filtering, and output it to a HTTP response in a given `format`.
A **Dataset** fetch Orders, or Validation, or any via a ORM, with a prebuild Query.
We can add or delete as many Dataset as we need.
Some will fit most customers' need, other will be more specific. 
So we can tell that many Dataset can be expected to be added over time

A Formatter is a one-class function that takes a Dataset as input and outputs it to a given specific format, be it CSV, XML, CSV Zipped, ...
As well as Dataset, we can add as many Formatters as we need.
But few new formatters might be added over time.

The export API est is organized as follows : 

- `/src/api-rest` contains :
all about controllers, pipes, swagger config (openAPI)

- `/src/common` contains :
db config and ORM service
embeds core models

- `/src/datasets/datasets` contains:
every single datasets available for query

- `/src/formatters/formatters`
every formatter available to output a given dataset


## How to create a new Dataset

A Dataset is technically a NestJS Service that respect a given interface and hold some metadata for being identified
You can inspire from a existing Dataset class to duplicate its skeleton

Four mandatory steps :
1. auto-generate a NestJS sevice class
2. identity the service with a Decorator
3. implement the fetch() method
4. Add the service to the index



### 1. Auto generate a NestJS service class

    $ nest g service datasets/datasets/my-dataset    
Add a ".dataset" suffix to the generated .ts file.

### 2. Make the service identifiable
NestJS will mount the service inside a discoverable Service Registry.
So it must be named so as to be retrieved.

    const decorator = {
        id: "myDecorator",
        description: "retrieves some kind of data"
    };

    @Injectable()
    @DatasetDecorator(decorator)
	export class MyDataset extends IDataset {
		consructor(){
			super(decorator.id);
		}
	}

### 3. Implement the fetch() method 
Let be guided with the abstract class `IDataset` from common
   
	@Injectable()
    @DatasetDecorator(decorator)
    export class MyDataset extends IDataset {
		async  fetch(
			options:  IDatasetFetchOptions<OrdersDatasetFilters>,
		):  Promise<Snapshot> {
			...
		}
	}

### 4. Add the service to the index

#### IDE extension way :
Either you have [generate-file](https://marketplace.visualstudio.com/items?itemName=kingdaro.generate-index) VS-code extension :
from the service file opened : Ctrl +Shift + P > "Generate / update index file"
that will add the current file to the `index.ts` file in the same folder.
Then the NestJS Discovery Service loads all files from the index.ts
(/datasets/datasets/index.ts)

#### Manual way :    
Or add manually the file path to the index.ts file : 

    // /datasets/datasets/index.ts
    ...
    export * from "./my.dataset";


### Check with Swagger that Rest API is up-to-date

#### Run the server :

    $ yarn start:dev

#### Go to Swagger doc :
[http://localhost:3000/datasets](http://localhost:3000/datasets)

`MyDataset` should be available as part of the collection of datasets