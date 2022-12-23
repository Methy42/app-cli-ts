import EventEmitter from "events";

export interface IBaseAppOption {
  metatronClassArray: Function[];

  pluginArray: BasePlugin[];
}

export class BaseApp {

}

export class BasePlugin {
  /**
   * Triggered when app is starting.
   * @type { Function }
   * @param { BaseRuntime } runtime 
   */
  onAppStart(runtime) {};

  /**
   * Triggered when app is stopping.
   * @type { Function }
   * @param { BaseRuntime } runtime 
   */
  onAppStop(runtime) {};

  /**
   * Triggered when app is restarting.
   * @type { Function }
   * @param { BaseRuntime } runtime 
   */
  onAppRestart(runtime) {};

  /**
   * Register metatrons to runtime use array.
   * @type { Function }
   * @param { Function[] } metatronClassArray
   * @param { BaseRuntime } runtime
   */
  registerMetatron(metatronClassArray, runtime) {};
}

export class BaseRuntime extends EventEmitter {
  /**
   * @type {{ [metatronClassName: string]: Function }}
   */
  metatronClassMap: { [metatronClassName: string]: Function } = new Proxy({}, {
    get: (target, property: string, receiver) => {
      this.emit("metatronClassMap.get", { receiver, ...JSON.parse(JSON.stringify({ target, property })) });
      return target[property];
    },
    set: (target, property, value, receiver) => {
      this.emit("metatronClassMap.set", { receiver, ...JSON.parse(JSON.stringify({ target, property, value })) });
      console.log(receiver);
      if (target.type instanceof BaseApp || target.type instanceof BasePlugin) {
        target[property] = value;
        return true;
      } else {
        this.emit("metatronClassMap.set.failed", { receiver, ...JSON.parse(JSON.stringify({ target, property, value })) });
        return false;
      }
      
    }
  });

  /**
   * @type {{ [metatronClassName: string]: BaseMetatron }}
   */
  metatronMap = new Proxy({}, {
    get: (target, property, receiver) => {
      this.emit("metatronMap.get", { receiver, ...JSON.parse(JSON.stringify({ target, property })) });
      return target[property];
    },
    set: (target, property, value, receiver) => {
      this.emit("metatronMap.set", { receiver, ...JSON.parse(JSON.stringify({ target, property, value })) });
      console.log(target.type);
      if (target.type instanceof BaseApp || target.type instanceof BasePlugin) {
        target[property] = value;
        return true;
      } else {
        this.emit("metatronMap.set.failed", { receiver, ...JSON.parse(JSON.stringify({ target, property, value })) });
        return false;
      }
      
    }
  });

  /**
   * @type {{ [pluginsName: string]: BasePlugin }}
   */
  pluginsMap = new Proxy({}, {
    get: (target, property, receiver) => {
      this.emit("pluginsMap.get", { receiver, ...JSON.parse(JSON.stringify({ target, property })) });
      return target[property];
    },
    set: (target, property, value, receiver) => {
      this.emit("pluginsMap.set", { receiver, ...JSON.parse(JSON.stringify({ target, property, value })) });
      target[property] = value;
      return true;
    }
  });
}