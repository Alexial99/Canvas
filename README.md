## Как использовать в своём проекте?
**1.** Поместите файл canvas.js в папку с вашим проектом

**2.** Подключите файл canvas.js к вашей странице в элементе `<head>`:
```html
<head>
    <script src="canvas.js"></script>
</head>
```

**3.** Создайте на вашей странице пустой `<div>` и задаейте ему уникальный `id`.
```html
<div id="container"></div>
```

**4.** Создайте тэг `<script>`, в котором создайте экземпляр класса `Chart`, передав ему все нужные параметры.

Параметры:
`axisNameX, axisNameY` - название осей x  и y соответсвенно

`lineCharts ` - объект, содержащий для построения графиков
Пример:
```javascript
lineCharts ={
	parabola: [[50,0], [40,100], [60,100], [30, 400], [70, 400]],
	line: [[0,0], [20, 20], [60, 60], [100, 100]]
}
```

`colorLine` - объект, содержащий настройки цветов для графиков (значение по умолчанию - `"black"`)
Пример:
```javascript
colorLine={
	parabola: "red",
	line:"blue",
}
```

`container` - id контейнера, в который будет вставлен график (в примере `container = "container"`

`size` - размер элемента с графиком в px. На данный момент доступны только квадратные элементы, поэтому данный параметр принимает одно число

`showAxisValues = false` - параметр, определяющий нужно ли отобрадать цену деления (по умолчанию `false`)

### Полный пример
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="canvas.js"></script>
</head>
<body>
<div id="container"></div>
<script>

new Chart(
	axisNameX = "X",
	axisNameY = "Y",
	lineCharts ={
		parabola: [[50,0], [40,100], [60,100], [30, 400], [70, 400]],
		line: [[0,0], [20, 20], [60, 60], [100, 100]]
	},
	colorLine={
		parabola: "red",
		line:"blue",
	},
	container = "container",
	size = 500,
	showAxisValues = true,
);

</script>
</body>
</html>
```

## Посмотреть в работе:
[**демо-страница**](https://alexial99.github.io/)

