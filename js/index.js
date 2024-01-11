document.addEventListener('DOMContentLoaded', function () {
    // Get references to HTML elements
    const githubForm = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');

    // Variable to store the current search type (user or repo)
    let currentSearchType = 'user';

    // Add an event listener to the form for handling user submission
    githubForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const keyword = searchInput.value.trim();
        if (keyword !== '') {
            if (currentSearchType === 'user') {
                searchUser(keyword);
            } else {
                searchRepositories(keyword);
            }
        }
    });

    // Add an event listener to the search button for toggling search type
    searchButton.addEventListener('click', function () {
        // Toggle between user and repo search types
        currentSearchType = currentSearchType === 'user' ? 'repo' : 'user';
        searchInput.placeholder = `Search ${currentSearchType === 'user' ? 'Users' : 'Repositories'}`;
    });

    // Function to fetch user data from GitHub User Search Endpoint using traditional Promise
    function searchUser(keyword) {
        fetch(`https://api.github.com/search/users?q=${keyword}`)
            .then(response => response.json())
            .then(data => {
                displayResults(data.items);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }

    // Function to fetch repositories from GitHub Repos Search Endpoint using traditional Promise
    function searchRepositories(keyword) {
        fetch(`https://api.github.com/search/repositories?q=${keyword}`)
            .then(response => response.json())
            .then(data => {
                displayRepositories(data.items);
            })
            .catch(error => {
                console.error('Error fetching repositories:', error);
            });
    }

    // Function to display user search results on the page
    function displayResults(users) {
        userList.innerHTML = ''; // Clear previous results

        users.forEach(user => {
            const userItem = document.createElement('li');
            userItem.innerHTML = `
                <img src="${user.avatar_url}" alt="${user.login}" width="50">
                <p>${user.login}</p>
                <a href="${user.html_url}" target="_blank">View Profile</a>
            `;
            userItem.addEventListener('click', function () {
                getRepositories(user.login);
            });

            userList.appendChild(userItem);
        });
    }

    // Function to display repository search results on the page
    function displayRepositories(repositories) {
        reposList.innerHTML = ''; // Clear previous repositories

        repositories.forEach(repo => {
            const repoItem = document.createElement('li');
            repoItem.innerHTML = `
                <p><strong>${repo.name}</strong></p>
                <p>${repo.description || 'No description available'}</p>
            `;
            reposList.appendChild(repoItem);
        });
    }
});
