module.exports = {
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: [
        "**/src/*.{js,jsx}",
        "utils/*.{js,jsx}",
        "!**/node_modules/**",
        "!**/vendor/**",
        "!**/mocks/**"
    ]
};
