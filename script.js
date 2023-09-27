const userID = "1011147820524388352"; //put your discord user id here. like my ID: 738748102311280681
const statusImage = document.getElementById("status-image");
const avatarImage = document.getElementById("avatar-image");
const bannerImage = document.getElementById("banner-image");
const banner = document.getElementById("banner");
const display_name = document.querySelector(".text-username");
const username = document.querySelector(".text-base");

async function fetchDiscordStatus() {
	try {
		const response = await axios.get(
			`https://api.lanyard.rest/v1/users/${userID}`
		);

		const lookupResponse = await axios.get(
			`https://discordlookup.mesavirep.xyz/v1/user/${userID}`
		);
		const { data } = response.data;
		const { discord_status, activities, discord_user } = data;
		const { avatar, banner } = lookupResponse.data;

		display_name.innerHTML = discord_user.display_name; // Change the display name.
		username.innerHTML = discord_user.username; // Change the username.

		// Get the corresponding image path for the status.
		let imagePath;
		switch (discord_status) {
			case "online":
				imagePath = "/public/status/online.svg";
				break;
			case "idle":
				imagePath = "/public/status/idle.svg";
				break;
			case "dnd":
				imagePath = "/public/status/dnd.svg";
				break;
			case "offline":
				imagePath = "/public/status/offline.svg";
				break;
			default:
				imagePath = "/public/preload.png";
				break;
		}

		// Check the streaming activity of user to update the image path.
		if (
			activities.find(
				(activity) =>
					activity.type === 1 &&
					(activity.url.includes("twitch.tv") ||
						activity.url.includes("youtube.com"))
			)
		) {
			imagePath = "/public/status/streaming.svg";
		}

		// if banner is null, set default color
		if (banner.id == null) {
			// bannerImage.style.backgroundColor = banner.color;
			bannerImage.src = "https://cdn.discordapp.com/attachments/1013408229860061317/1156517040622932069/z4651059371249_42835f42d3d19a0ab2d622969a057047.jpg?ex=651541ed&is=6513f06d&hm=f8b440b341e2ba4bb0f5fea4b80a8d31d017ef0b95e7147137b990b1ab925491&";
		}
		// else set banner image
		else {
			bannerImage.src = `https://cdn.discordapp.com/banners/${discord_user.id}/${banner.id}?format=webp&size=1024`;
			bannerImage.alt = `Discord banner: ${discord_user.username}`;
		}
		// Update the image.
		statusImage.src = imagePath;
		statusImage.alt = `Discord status: ${discord_status}`;
		avatarImage.src = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}?format=webp&size=1024`;
		avatarImage.alt = `Discord avatar: ${discord_user.username}`;
	} catch (error) {
		console.error("Unable to retrieve Discord status:", error);
	}
}


fetchDiscordStatus();
setInterval(fetchDiscordStatus, 10000); // Update status every 10 seconds
