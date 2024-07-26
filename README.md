# grandfeast-1a

Web app project for Ticket Reservation

Live demo (beta): [link](https://main--grand-feast-uk-x-europe.netlify.app/)

## To deploy to production

1. Checkout `prod` branch
```bash
git checkout prod
```

2. Merge `develop` to `prod`, and push
```bash
make pull-develop
git push
```

## To run

1. install dependencies
```bash
make install
```

2. setup a .env file to store config/secrets for the app, then enter the real values
```bash
cp example.env .env
```

3. run the development server
```bash
make run
```