export interface ITemplateNode {
  name: string;
  attrs: IAttributeObject;
  children?: ITemplateNode | ITemplateNode[];
}

export interface IAttributeObject {
  static: {
    [key: string]: string | number | boolean | undefined | null;
    ref?: string;
  };
  dynamic: {
    [key: string]: Function | undefined;
    if?: Function;
    each?: Function;
  } & ThisType<any>;
  event: {[key: string]: EventListener} & ThisType<any>;
}

export interface IStyleMediaRule {
  type: 'media';
  media: string;
  selectors: IStyleRule[];
}

export interface IStyleRule {
  type: 'rule';
  selector: string;
  rules: string;
}

export type IMixedStyle = IStyleRule | IStyleMediaRule;
