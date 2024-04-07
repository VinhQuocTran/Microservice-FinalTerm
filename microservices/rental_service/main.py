from app import create_app

app = create_app()

# Port: 8000
if __name__ == '__main__':
    app.run(debug=True,port=3002)