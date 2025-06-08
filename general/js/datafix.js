

export function from_json(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const json = JSON.parse(e.target.result);
        console.log(json);
    };
    reader.readAsText(file);
}

export function export_json(path) {

}