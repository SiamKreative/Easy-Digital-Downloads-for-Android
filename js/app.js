jQuery(document).ready(function ($) {

	var apiKey = $('#setting_api_key');
	var apiToken = $('#setting_api_token');
	var routeStats = 'https://getawesomesupport.com/edd-api/stats/';
	var routeSales = 'https://getawesomesupport.com/edd-api/sales/';

	/*
	Get Settings
	 */
	if (localStorage.getItem('edd_settings')) {
		var settings = JSON.parse(localStorage.getItem('edd_settings'));
		var params = {
			key: settings.apiKey,
			token: settings.apiToken
		};
		var endpointStats = 'https://jsonp.afeld.me/?callback=?&url=' + encodeURIComponent(routeStats + '?' + $.param(params));
		var endpointSales = 'https://jsonp.afeld.me/?callback=?&url=' + encodeURIComponent(routeSales + '?' + $.param(params));

		/*
		Show existing settings
		 */
		apiKey.val(settings.apiKey);
		apiToken.val(settings.apiToken);

		/*
		Get the Statistics
		 */
		function renderEarnings() {
			$('.hide-while-ajax').fadeIn().prev('.mdl-spinner').remove();
			var json = JSON.parse(localStorage.getItem('edd_earnings'));
			var edd_earnings_yesterday = 0;

			var earnings_month_change = ((json.stats.earnings.current_month - json.stats.earnings.last_month) / json.stats.earnings.last_month * 100).toFixed(1);
			var edd_earnings_day_change = (edd_earnings_yesterday - json.stats.earnings.today);

			$('#edd_earnings_current_month').text(json.stats.earnings.current_month);
			$('#edd_earnings_last_month').text(json.stats.earnings.last_month);

			if (earnings_month_change >= 0) {
				$('#edd_earnings_month_change').addClass('percent_plus').text(earnings_month_change + '%');
			} else {
				$('#edd_earnings_month_change').addClass('percent_minus').text(earnings_month_change + '%');
			}

			$('#edd_earnings_today').text(json.stats.earnings.today);
			$('#edd_earnings_yesterday').text(0);

			if (edd_earnings_day_change >= 0) {
				$('#edd_earnings_day_change').addClass('percent_plus').text(edd_earnings_day_change + '$');
			} else {
				$('#edd_earnings_day_change').addClass('percent_minus').text(edd_earnings_day_change + '$');
			}

		};

		if (localStorage.getItem('edd_earnings')) {
			renderEarnings();
		} else {
			$.ajax({
				dataType: 'json',
				url: endpointStats,
				localCache: true,
				cacheKey: 'edd_earnings'
			}).done(function (json) {
				renderEarnings();
			});
		}

		/*
		Clear Data
		 */
		function clearData() {
			localStorage.removeItem('edd_earnings');
			localStorage.removeItem('edd_sales');
			location.reload();
		}
		$('#clearData').on('click', function (event) {
			event.preventDefault();
			clearData();
		});

		/*
		Get the Sales
		 */
		function renderSales() {
			$('.hide-while-ajax').fadeIn().prev('.mdl-spinner').remove();
			var json = JSON.parse(localStorage.getItem('edd_sales'));
			var tbl_body = "";

			$.each(json.sales, function (index, val) {
				var tbl_row = "";
				var products = "";
				tbl_row += "<td class='mdl-data-table__cell--non-numeric hidden-xs'>" + val.date + "</td>";
				tbl_row += "<td class='mdl-data-table__cell--non-numeric hidden-xs'><a href='mailto:" + val.email + "'>" + val.email + "</a></td>";
				$.each(val.products, function (i, v) {
					products += " <span>" + v.name + "</span>";
				});
				tbl_row += "<td class='mdl-data-table__cell--non-numeric white-space-normal'>" + products + "</td>";
				tbl_row += "<td>$" + val.total + "</td>";
				tbl_body += "<tr>" + tbl_row + "</tr>";
			})

			$("#table_edd_sales tbody").html(tbl_body);
		};

		if (localStorage.getItem('edd_sales')) {
			renderSales();
		} else {
			$.ajax({
				dataType: 'json',
				url: endpointSales,
				localCache: true,
				cacheKey: 'edd_sales'
			}).done(function (json) {
				renderSales();
			});
		}

	} else {
		alert('API credential not found. Please edit the General Settings.');

		/*
		Save Settings
		 */
		$('#setting_form').on('submit', function (event) {
			event.preventDefault();
			var saveSettings = {
				'apiKey': apiKey.val(),
				'apiToken': apiToken.val()
			};
			localStorage.setItem('edd_settings', JSON.stringify(saveSettings));
		});

	}

});