import { Client, Configuration } from "bugsnag-react-native";
import Config from "react-native-config";

const configuration = new Configuration();

if (Config.ENV === "dev") {
  configuration.autoNotify = false;
}

configuration.notifyReleaseStages = ["production"]; // Will also notify for adhoc release
configuration.handlePromiseRejections = false;

const bugsnag = new Client(configuration);

export default bugsnag;
