# TypingLeague

TypingLeague is a competitive online typing platform, much like MonkeyType. It allows users to test and improve their typing speed while competing globally or in private leagues. The platform features authentication via JWT and Google Sign-In, and users can personalize their experience with customizable themes.

## Features

- **Typing Area**: Users can practice typing as fast as possible.
  
  ![image](https://github.com/user-attachments/assets/2c96dcd9-12d9-4a29-9f1f-b43cec017969)

- **User Authentication**: Secure authentication with JWT and Google Sign-In.

  ![image](https://github.com/user-attachments/assets/17889452-fc59-4a14-9a97-4453e9f81c41)

- **Profile Management**: Users can create, view, and manage their profile.
  
  ![image](https://github.com/user-attachments/assets/0a97fa65-32e7-4b54-b372-3d320ea272b1)

- **Global Ranking**: Compete with other users worldwide and track your position on the leaderboard.

  ![image](https://github.com/user-attachments/assets/7533dc35-12dc-4cf6-a72e-7bac7810c821)

- **Leagues**: Users can create and join leagues, which function as mini leaderboards for private competitions.

  ![image](https://github.com/user-attachments/assets/1bea44a1-d256-4871-a124-5a4b156c846a)
  ![image](https://github.com/user-attachments/assets/9e1d6f29-8a16-47c8-af4e-d0c84aaf3af4)

- **Theme Customization**: Easily change the website's theme with a single click.

![image](https://github.com/user-attachments/assets/9e49af89-9ad1-4ddb-a0ec-ac80712ec813)

## Tech Stack

- **Frontend**: React
- **Backend**: Django-rest
- **Authentication**: JWT & Google Sign-In

## Installation & Setup

### Backend Setup

1. Clone the repository:

   ```python
   https://github.com/abdelhak-k/typing-league.git
   cd backend
   ```

2. Create a virtual environment and activate it:

   ```python
   python -m venv venv
   .venv\Scripts\activate
   # or: source venv/bin/activate
   ```

3. Install dependencies:

   ```python
   pip install -r requirements.txt
   ```

4. create a super user:

   ```python
   python manage.py createsuperuser
   ```

5. Apply migrations:

    ```python
    python manage.py migrate
    ```

6. Run the development server:
   ```python
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend folder:
   ```python
   cd frontend
   ```
2. Install dependencies:
   ```python
   npm install
   ```
3. Start the frontend development server:
   ```python
   npm run dev
   ```

## Usage

- Visit *http\://localhost:5173* to access the application.

- Sign in using Google authentication.

- visit [*http://127.0.0.1:8000/admin*](http://127.0.0.1:8000/admin) enter the super user information, and add google as a social app with the credentials you have on your google app.

## Contributing

Contributions are welcome.

