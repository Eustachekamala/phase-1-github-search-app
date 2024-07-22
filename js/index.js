document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const searchInput = document.querySelector("#search");

    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent form submission

        const searchQuery = searchInput.value.trim();
        if (searchQuery === '') {
            alert("Please enter a GitHub username to search.");
            return;
        }

        getUsers(searchQuery)
            .then(users => {
                renderUsers(users);
            })
            .catch(error => {
                console.error("Error fetching GitHub users:", error);
                alert("Failed to fetch GitHub users. Please try again later.");
            });

        // Clear repositories list if needed
        clearRepositories();
    });

    // Initial fetching and rendering of users and repositories
    getUsers()
        .then(users => {
            renderUsers(users);
        })
        .catch(error => {
            console.error("Error fetching initial GitHub users:", error);
            alert("Failed to fetch initial GitHub users. Please try again later.");
        });

    getRepositories()
        .then(repositories => {
            renderRepositories(repositories);
        })
        .catch(error => {
            console.error("Error fetching initial repositories:", error);
            alert("Failed to fetch initial repositories. Please try again later.");
        });

    form.reset(); // Reset form fields after initial loading
});

function renderUsers(users) {
    const userList = document.querySelector("#user-list");
    userList.innerHTML = ''; // Clear existing user list

    users.forEach(user => {
        const listItem = document.createElement("li");
        listItem.textContent = user.login; // Displaying user login
        userList.appendChild(listItem);
    });
}

function renderRepositories(repositories) {
    const repositoriesList = document.querySelector("#repos-list");
    repositoriesList.innerHTML = ''; // Clear existing repositories list

    repositories.forEach(repository => {
        const listItem = document.createElement("li");
        listItem.textContent = repository.full_name; // Displaying repository full name
        repositoriesList.appendChild(listItem);
    });
}

function getUsers(query = 'octocat') {
    return fetch(`https://api.github.com/search/users?q=${query}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Failed to fetch users: ${res.status}`);
            }
            return res.json();
        })
        .then(data => data.items)
        .catch(error => {
            console.error('Error fetching users:', error);
            throw error; // Propagate the error
        });
}

function getRepositories(username = 'octocat') {
    return fetch(`https://api.github.com/users/${username}/repos`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Failed to fetch repositories: ${res.status}`);
            }
            return res.json();
        })
        .then(data => data)
        .catch(error => {
            console.error('Error fetching repositories:', error);
            throw error; // Propagate the error
        });
}

function clearRepositories() {
    const repositoriesList = document.querySelector("#repos-list");
    repositoriesList.innerHTML = ''; // Clear repositories list
}
