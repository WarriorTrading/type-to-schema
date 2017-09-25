import * as _ from 'lodash';
import 'reflect-metadata';

import { IProperyOptions, IArrayPropertyOptions, IObjectOptions } from './typings';
import { PropertyTypes, MetadataKeys } from './enums';
import { checkOptions, addPropertyKey, getType, setObjectOptions, setPropertyOptions } from './utils';
import { NoItemTypeProvidedError, PropertyIsNotArrayError, PropertyIsArrayError } from './errors';

export const property = (options?: IProperyOptions) => (target: any, key: string) => {
  const type = Reflect.getMetadata(MetadataKeys.TYPE, target, key);

  if (getType(type) === PropertyTypes.ARRAY) {
    throw new PropertyIsArrayError(target, key);
  }

  checkOptions(type, options);
  addPropertyKey(key, target);

  const propertyOptions = { options, type, array: false };

  setPropertyOptions(target, key, propertyOptions);
};

export const arrayProperty = (options: IArrayPropertyOptions) => (target: any, key: string) => {
  const type = Reflect.getMetadata(MetadataKeys.TYPE, target, key);

  if (getType(type) !== PropertyTypes.ARRAY) {
    throw new PropertyIsNotArrayError(target, key);
  }

  if (!options || !options.items) {
    throw new NoItemTypeProvidedError(target, key);
  }

  const itemOptions = _.get(options, 'itemOptions');
  checkOptions(options.items, itemOptions);
  addPropertyKey(key, target);

  const propertyOptions = { options, array: true };

  setPropertyOptions(target, key, propertyOptions);
};

export const objectOptions = (options?: IObjectOptions) => <T>(target: { new(): T }) => {
  setObjectOptions(target, options);

  return target;
};
