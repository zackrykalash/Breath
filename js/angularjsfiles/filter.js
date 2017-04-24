appManager

    .filter('capitalizefirstletter', function() {
        return function(value) {
            if(value == undefined || value == null)
            {
                return "";
            }
            value = value.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });
            return value;
        }
    })

    .filter('DisplayDateTime', function (DateTimeFormats) {
        return function (value) {
            if (!value || (typeof value == "object" && !value._isAMomentObject)) {
                return "";
            }
            return moment(value).format(DateTimeFormats.DisplayDateTime);
        }
    })

;