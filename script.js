const run = async () => {
    const profileUrl = `http://146.185.154.90:8000/blog/dima@mail.ru/profile`;
    const postsUrl = `http://146.185.154.90:8000/blog/dima@mail.ru/posts`;
    const subscribeUrl = `http://146.185.154.90:8000/blog/dima@mail.ru/subscribe`;

    const lastName = document.querySelector('.lastName');
    const firstName = document.querySelector('.firsName');
    const inputLastName = document.querySelector('[name="lastName"]');
    const inputFirsName = document.querySelector('[name="firstName"]');
    const formProfile = document.querySelector('.profile');
    const containerPost = document.querySelector('.live-post');
    const formPost = document.querySelector('.posts');
    const formSubscribe = document.querySelector('.subscribe-user');
    const namePost = document.querySelector('[name="name-post"]');
    const nameEmail = document.querySelector('[name="email"]');
    const myModalAlternative2 = new bootstrap.Modal('#exampleModal2');
    const myModalAlternative = new bootstrap.Modal('#exampleModal');
    const openSubscribe = document.querySelector('.open-subscribe');
    const modalBody = document.querySelector('.modal-body');
    const deleteSubscribes = document.querySelector('.delete-subscribes');

    const getProfile = async () => {
        const profile = await fetch(profileUrl);
        return await profile.json();
    }

    const getResultPost = await getProfile();

    lastName.innerHTML = getResultPost.lastName;
    firstName.innerHTML = getResultPost.firstName;

    formProfile.addEventListener('submit', e => {
        e.preventDefault();

        const body = new URLSearchParams();

        body.append('lastName', inputLastName.value);
        body.append('firstName', inputFirsName.value);

        fetch(profileUrl, {method: 'POST', body});

        myModalAlternative.hide();
        lastName.innerHTML = inputLastName.value;
        firstName.innerHTML = inputFirsName.value;
    });

    const getPost = async () => {
        const post = await fetch(postsUrl);
        return await post.json();
    }

    const resultPosts = await getPost();

    let datetime = resultPosts[resultPosts.length -1].datetime;


    for(const post of resultPosts.reverse()) {
        containerPost.innerHTML += `
            <div class="card mb-3">
                <div class="card-header">Пост</div>
                <div class="card-body">
                    <h3 class="text-uppercase"> ${post.user['lastName']} ${post.user['firstName']} said</h3>
                    <p>${post.message}</p>
                </div>
            </div>
        `;
    }

    setInterval(async () => {
        const newPost = await fetch(postsUrl + `?datetime=${datetime}`);
        const newContentPost = await newPost.json();

        if (newContentPost.length > 0) {
            datetime = newContentPost[newContentPost.length - 1].datetime;

            for(const post of newContentPost) {
                const div = document.createElement('div');
                div.className = 'card mb-3';
                div.innerHTML = `
                    <div class="card-header"> Пост</div>
                    <div class="card-body">
                        <h3 class="text-uppercase"> ${post.user['lastName']} ${post.user['firstName']} said</h3>
                        <p>${post.message}</p>
                    </div>
                `
                containerPost.firstElementChild.before(div);
            }
        }

    }, 2000)

    formPost.addEventListener('submit', e => {
        e.preventDefault();

        const body = new URLSearchParams();

        body.append('message', namePost.value);

        fetch(postsUrl, {method: 'POST', body});

        namePost.value = '';

    });

    formSubscribe.addEventListener('submit', e => {
        e.preventDefault();

        const body = new URLSearchParams();

        body.append('email', nameEmail.value);

        fetch(subscribeUrl, {method: 'POST', body})

        myModalAlternative2.hide();
    })

    openSubscribe.addEventListener('click', async () => {
        const getMySubscribe = await fetch(subscribeUrl);
        const subscribes = await getMySubscribe.json();

        for(const subscribe of subscribes) {
            modalBody.innerHTML += `
                <div class="card mb-3">
                    <div class="card-header">Подписчек</div>
                    <div class="card-body">
                        <h3 class="text-uppercase"> ${subscribe['lastName']} ${subscribe['firstName']}</h3>
                        <p>${subscribe.email}</p>
                    </div>
                </div>
            `
        }
    })

    deleteSubscribes.addEventListener('click', () => {
        fetch(subscribeUrl + '/delete', {method: 'POST'});
        modalBody.innerHTML = '';
    })


}

run().catch(console.error);