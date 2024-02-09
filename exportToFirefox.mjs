import json from "./dist_firefox/manifest.json" assert { type: "json" };
import * as fs from 'fs';

console.log("Chrome manifest:")
console.log(json)
json['background'] = {
    "scripts": [ json['background']['service_worker'] ]
}
json['browser_specific_settings'] = {
    "gecko": {
        "id": "uwwave@uwwave.ca",
        "strict_min_version": "42.0"
    }
}
console.log("Adapted manifest for Firefox:")
console.log(json)

const data = JSON.stringify(json)

fs.writeFile("./dist_firefox/manifest.json", data, (error) => {
    // throwing the error
    // in case of a writing problem
    if (error) {
        // logging the error
        console.error(error);
        throw error;
    }

    console.log("manifest.json written correctly");
});
