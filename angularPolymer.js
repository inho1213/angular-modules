(function (window) {
	'use strict';
	
	/**
	 * Angular & Polymer inter 2-way data binding
	 * 
	 * <paper-input bind-scope>
	 * 
	 * By default, bind polymer element's checked, disabled, opened, selected, selectedIndex, value property to angular scope.
	 * The variable name which is bound to scope starts with polymer element name. 
	 * e.g. paperInputChecked, paperInputDisabled, ...
	 * 
	 * <paper-input bind-scope="value">
	 * 
	 * Bind only value property.
	 * 
	 * <paper-input bind-scope="value disabled">
	 * 
	 * Bind value and disabled property. (multiple binding)
	 * 
	 * <paper-input bind-scope="value disabled:isEnable">
	 * 
	 * Bind disabled property to isEnable scope variable. (alias binding)
	 */
	angular.module('angularPolymer', []).directive('bindScope', function() {
		var defaultAttributes = ['checked', 'disabled', 'opened', 'selected', 'selectedIndex', 'value'];

		function capitalize(str) {
			return str ? str.charAt(0).toUpperCase() + str.substr(1) : str;
		}

		return {
			restrict: 'A',
			link: function($scope, $element, $attrs) {
				var target = $element[0];
				var values = $attrs.bindScope;

				if (values) {
					values = values.split(' ');
				} else {
					values = angular.copy(defaultAttributes);
				}

				values.forEach(function(value) {
					var name, original, currentValue, scopeName = value.split(':');

					value = scopeName[0];
					scopeName = scopeName[1] || $attrs.$normalize(target.tagName.toLowerCase()) + capitalize(value);
					
					if ((currentValue = target[value]) !== undefined) {
						name = value + 'Changed';
						original = target[name];

						target[name] = function(oldValue, newValue) {
							if (typeof original === 'function') {
								original.call(target, oldValue, newValue);
							}
								
							$scope[scopeName] = newValue;
							$scope.$apply();
						};
						
						if (currentValue !== $scope[scopeName]) {
							$scope[scopeName] = target[value];
							$scope.$applyAsync();
						}
					}
				});
			}
		};
	});
})(this);
