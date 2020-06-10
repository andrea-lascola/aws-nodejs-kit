/**
 * This shows the usage of a Plugin and the execution phase
 */
import {BasePlugin} from "../src/core";


/**
 * Start implementing a plugin:
 *
 * match -> boolean check on "this.input" value
 *          if this method return "true", the plugin is enabled and will execute "run"
 *
 * run -> run the plugin logic, optionally use a service injected in the constructor
 */
class MyPlugin extends BasePlugin<string> {
    match() {
        return this.input === "ok";
    }

    async run(): Promise<void> {
        console.log(this.input, "run");
    }
}


(async () => {
    const plugins = [
        new MyPlugin().using("Y"),
        new MyPlugin().using("ok"), // this should trigger
        new MyPlugin().using("yes"),
        new MyPlugin().using("ok") // this should trigger
    ];
    await Promise.all(plugins.map(p => p.execute()));
})();

