DEFINE TABLE subscription SCHEMALESS PERMISSIONS FOR select, update, delete, create WHERE true;

DEFINE EVENT item_updated ON TABLE item WHEN $event = "UPDATE" THEN {
	IF $after.quantity = 0 THEN {
		LET $subscriptions = SELECT endpoint, keys, expirationTime, user[WHERE workspace = type::string($after.workspace)] FROM subscription;

		FOR $subscription IN $subscriptions {
			http::post('http://web:3000/api/push', {
				subscription: $subscription,
				message: {
					title: "You finished an item!"
				}
			});
		}
	} END;
}