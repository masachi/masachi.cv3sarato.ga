---
title: Flutter 整理
date: '2022-02-24'
tags: ['Flutter', '分享', '摸鱼']
draft: false
summary: Flutter一些个人整理
---



## Flutter
### 1. 布局
Flutter的布局 与 前端的 Flex 差不多，同样是分为Row 与 Column。与前端Flex布局一样，将所有的布局样式拆成最小不可分隔的Row 或者Column，然后根据Row或者Column去做布局，如果说要加Padding，文档上写的是在需要加Padding或者Margin元素外套一层Container，类似前端的div，在div层做Padding Margin等操作

### 2. Stateful & Stateless
有些 widgets 是有状态的, 有些是无状态的。如果用户与 widget 交互，widget 会发生变化，那么它就是 有状态的。

无状态的 widget 自身无法改变。 Icon、IconButton 和 Text 都是无状态 widget，它们都是 StatelessWidget 的子类。

而 有状态的 widget 自身是可动态改变的（基于State）。例如，可以通过与用户的交互或是随着数据的改变而导致外观形态的变化。 Checkbox、Radio、Slider、 InkWell、Form 和 TextField 都是有状态 widget，它们都是 StatefulWidget 的子类。

一个 widget 的状态保存在一个 State 对象中，它和 widget 的显示分离。 Widget 的状态是一些可以更改的值，如一个滑动条的当前值或一个复选框是否被选中。当 widget 状态改变时，State 对象调用 setState()，告诉框架去重绘 widget。

说到底这个和React中的state的理念一样，同样也是通过state的变化来控制页面显示的元素或者元素的状态，这里的所说的元素就是Widget。

但是在Flutter里面创建一个包含State的Widget需要先创建StatefulWidget的子类 然后重写其createState方法 返回一个带State的Widget, 但是Dart里面没有像Java一样的匿名内部类，所以只能创建一个```State<SubClass of StatefulWidget>```的子类来build一个真正的Widget。

与React一样，Flutter也支持自己管理或者说类似的父组件管理或者说是Redux这样的库来管理State。
![](https://flutter.cn/assets/images/docs/development/data-and-backend/state-mgmt/ephemeral-vs-app-state.png)
```
我不认为完全使用Redux或者其他类似的状态管理的东西 来全局做管理。
这个在React下试过会形成一个极度糟糕的情况，任意组件触发更新就要从顶层一路下来做刷新。我个人倾向于每个组件自己管理自己的State，而公用的State或者是一些变量可存放到类似globalData中

当我们就 React 的 setState 和 Redux 的 Store 哪个好这个问题问 Redux 的作者 Dan Abramov 时, 他如此回答:
“经验原则是: 选择能够减少麻烦的方式”
```
总之，在任何 Flutter 应用中都存在两种概念类型的状态，短时状态经常被用于一个单独 widget 的本地状态，通常使用 State 和 setState() 来实现。其他的是你的应用应用状态，在任何一个 Flutter 应用中这两种状态都有自己的位置。如何划分这两种状态取决于你的偏好以及应用的复杂度。

### 3.网络请求
Flutter中网络请求可以用[http](https://pub.dev/packages/http)或者是[retrofit](https://pub.dev/packages/retrofit)

关于Dart中的Retrofit 虽然说是异步获取数据，支持async 与 await，返回值与Promise类似的是一个Future对象，也可使用then方法来获取数据，当出现错误的时候通过catchError来捕获错误
<details>
<summary>ApiClient.dart</summary>

```
@RestApi(baseUrl: "http://www.json-generator.com/api/json/get/cffBLmFKeW?")
abstract class RestClient {
  factory RestClient(Dio dio) = _RestClient;
  @POST("/indent={num}")
  Future<Post> getTasks(int num);
}

@JsonSerializable()
class Post{
  String name;
  int age;

  Post({this.name, this.age});

  factory Post.fromJson(Map<String, dynamic> json) =>  _$PostFromJson(json);
  Map<String, dynamic> toJson() => _$PostToJson(this);
}
```
</details>

<details>
<summary>页面</summary>

```
void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Home(),
    );
  }
}

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {


  bool pressed = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Retrofit Post Call"),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[


            RaisedButton(child: Text("Fetch Post"),
                onPressed: () => {setState(() {
                  pressed = true;
                  //fetchData(postNum);
                })}),
            
            Padding(padding: EdgeInsets.all(30)),

            pressed ? _buildBody(context): SizedBox(),

          ],
        ),
      ),
    );
  }
}

FutureBuilder<Post> _buildBody(BuildContext context) {
  final client = RestClient(Dio(BaseOptions(contentType: "application/json")));
  return FutureBuilder<Post>(
    future: client.getTasks(2),
    builder: (context, snapshot) {
      if (snapshot.connectionState == ConnectionState.done) {
        final Post posts = snapshot.data;
        return _buildPosts(context, posts);
      } else {
        return Center(
          child: CircularProgressIndicator(),
        );
      }
    },
  );
}

Widget _buildPosts(BuildContext context, Post posts) {
  return Center(
    child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[

          Text("Name : "+posts.name,style: TextStyle(fontSize: 30),),
          Text("Age : "+posts.age.toString(),style: TextStyle(fontSize: 30),),
        ],
      ),
  );

}
```
</details>
这里的页面用FutureBuilder来异步获取真实数据，当snapshot.connectionState == ConnectionState.done 或者 snapshot.hasData && !snapshot.data.documents.isEmpty 时，表示数据已经获取到了。当返回 snapshot.hasError 为true时 表示数据获取错误。

### 4. 自定义插件(Native Code)
