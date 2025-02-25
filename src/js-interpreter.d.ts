/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace acorn {
  interface Options {
    locations?: boolean;
    ecmaVersion?: number;
    sourceFile?: string;
  }

  interface Position {
    line: number;
    column: number;
  }

  interface SourceLocation {
    start: Position;
    end: Position;
    source?: string;
  }

  interface Node {
    type: string;
    start: number;
    end: number;
    loc?: SourceLocation;
    [key: string]: any;
  }

  function parse(input: string, options?: Options): Node;
}

// Task and State interfaces
interface InterpreterTask {
  node: acorn.Node;
  scope: any;
  interval: number;
  pid: number;
  time: number;
}

interface InterpreterState {
  node: acorn.Node;
  scope: any;
  done: boolean;
  value?: any;
}

// Main Interpreter class
declare class Interpreter {
  constructor(
    code: string,
    initFunction?: (interpreter: Interpreter, globalObject: any) => void
  );

  // Built-in constructors and prototypes
  readonly OBJECT: any;
  readonly OBJECT_PROTO: any;
  readonly FUNCTION: any;
  readonly FUNCTION_PROTO: any;
  readonly ARRAY: any;
  readonly ARRAY_PROTO: any;
  readonly REGEXP: any;
  readonly REGEXP_PROTO: any;
  readonly DATE: any;
  readonly DATE_PROTO: any;
  readonly ERROR: any;
  readonly EVAL_ERROR: any;
  readonly RANGE_ERROR: any;
  readonly REFERENCE_ERROR: any;
  readonly SYNTAX_ERROR: any;
  readonly TYPE_ERROR: any;
  readonly URI_ERROR: any;

  // Configuration properties
  REGEXP_MODE: number;
  REGEXP_THREAD_TIMEOUT: number;
  POLYFILL_TIMEOUT: number;

  // Global state
  globalObject: any;
  globalScope: any;
  paused_: boolean;
  value: any;

  // Main methods
  step(): boolean;
  run(): boolean;
  appendCode(code: string): void;
  getStatus(): Interpreter.Status;

  // Object creation methods
  createObject(constructor: any): any;
  createObjectProto(proto: any): any;
  createNativeFunction(nativeFunc: Function, isConstructor: boolean): any;
  createAsyncFunction(asyncFunc: Function): any;

  // Property access methods
  getProperty(obj: any, name: string): any;
  setProperty(
    obj: any,
    name: string,
    value: any,
    descriptor?: PropertyDescriptor
  ): any;
  hasProperty(obj: any, name: string): boolean;

  // Type conversion
  nativeToPseudo(nativeObj: any): any;
  pseudoToNative(pseudoObj: any): any;

  // Scope methods
  getGlobalScope(): any;
  setGlobalScope(scope: any): void;
  getStateStack(): InterpreterState[];
  setStateStack(stack: InterpreterState[]): void;
  createScope(node: acorn.Node, parentScope: any): any;
  getPrototype(obj: any): any;

  // Value handling
  getValue(ref: [any, string]): any;
  setValue(ref: [any, string], value: any): any;
  getValueFromScope(name: string): any;
  setValueToScope(name: string, value: any): any;

  // Type checking
  isa(child: any, constructor: any): boolean;

  // Error handling
  throwException(errorClass: any, message?: string): never;

  // Static members
  static readonly Status: {
    DONE: 0;
    STEP: 1;
    TASK: 2;
    ASYNC: 3;
  };

  static readonly Completion: {
    NORMAL: 0;
    BREAK: 1;
    CONTINUE: 2;
    RETURN: 3;
    THROW: 4;
  };

  static readonly VALUE_IN_DESCRIPTOR: symbol;

  // Property descriptors
  static readonly READONLY_DESCRIPTOR: PropertyDescriptor;
  static readonly NONENUMERABLE_DESCRIPTOR: PropertyDescriptor;
  static readonly READONLY_NONENUMERABLE_DESCRIPTOR: PropertyDescriptor;
  static readonly NONCONFIGURABLE_READONLY_NONENUMERABLE_DESCRIPTOR: PropertyDescriptor;
  static readonly VARIABLE_DESCRIPTOR: PropertyDescriptor;
}

// Namespace for types and enums
declare namespace Interpreter {
  type Status = 0 | 1 | 2 | 3;
  type CompletionType = 0 | 1 | 2 | 3 | 4;

  interface Scope {
    parentScope: Scope | null;
    strict: boolean;
    object: any;
  }

  interface Object {
    proto: Object | null;
    class: string;
    data: any;
    getter: { [key: string]: any };
    setter: { [key: string]: any };
    properties: { [key: string]: any };
    toString(): string;
    valueOf(): any;
  }
}

// Global declarations
declare global {
  interface Window {
    Interpreter: typeof Interpreter;
    acorn: typeof acorn;
  }
}

export = Interpreter;
