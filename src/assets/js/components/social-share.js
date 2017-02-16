var socialShare = $(".social-share");
if (socialShare.length) {
  require('../module/jssocials');
  socialShare.jsSocials({
    url: "http://www.google.com",
    text: "Google Search Page",
    showLabel: false,
    showCount: "inside",
    shares: [
      "twitter",
      "facebook",
      "googleplus",
      "linkedin",
      "pinterest"
    ]
  });
}