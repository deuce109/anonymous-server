require("isomorphic-fetch");

let randomString = () => {
    return (
        Math.random()
            .toString(36)
            .substring(2, 15) +
        Math.random()
            .toString(36)
            .substring(2, 15)
    );
};

for (i = 0; i < 100; i++) {
    let data = {};
    let dataElements = Math.round(Math.random() * 10);

    for (x = 0; x < dataElements; x++) {
        let key = randomString();

        data[key] = randomString();
    }
    fetch("http://localhost:3030/test/objects", {

        body: JSON.stringify(data),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        method: "POST",
    });
}
